import { Router } from "express";
import BookService from "../services/BookService";
import ts from "timeseries-analysis";
import moment from "moment";
// import ARIMA from "arima";

class timeseries {
  model = new ts.main([]);

  constructor(datasets) {
    this.model = new ts.main(datasets);
  }

  getBestSettings = (optionsArg) => {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          method: ["ARMaxEntropy", "ARLeastSquare"],
          sample: Math.round(this.model.data.length * 0.2),
          degree: Math.round(this.model.data.length * 0.2),
          ...optionsArg,
        };

        const bestSettings = {
          sample: null,
          degree: null,
          method: null,
          MSE: null,
        };
        let bestModel = new ts.main([]);

        for (let mtd = 0, len = options.method.length; mtd < len; mtd++) {
          for (
            let deg = 1;
            deg <= options.degree && deg <= options.sample;
            deg++
          ) {
            const model = new ts.main(this.model.data);

            const MSE = model.regression_forecast({
              method: options.method[mtd],
              sample: options.sample,
              degree: deg,
            });

            console.log(
              "Trying method(" +
                options.method[mtd] +
                ") sample(" +
                options.sample +
                ") degree(" +
                deg +
                ")\t" +
                MSE
            );

            if (!isNaN(MSE)) {
              if (bestSettings.MSE === null || MSE < bestSettings.MSE) {
                bestSettings["MSE"] = MSE;
                bestSettings["method"] = options.method[mtd];
                bestSettings["sample"] = options.sample;
                bestSettings["degree"] = deg;
                bestModel = model;
              }
            }
          }
        }
        resolve(bestSettings);
      } catch (err) {
        reject(err);
      }
    });
  };
}

const getResampledData = (rawData, interval) => {
  const data = rawData.slice();
  const processedData = [];

  data.forEach((val, idx) => {
    if (idx === 0 || !moment(val[0]).isSame(data[idx - 1][0], interval)) {
      processedData.push(val);
    } else {
      processedData[processedData.length - 1][1] += val[1];
    }
  });

  return processedData;
};

const f = (a, b) => {
  return a * 2 + b * 5;
};

const timeseriesTest1 = async () => {
  const raw = ts.adapter.complex({
    cycle: 10,
    inertia: 0.1,
  });
  let datasets = [];
  for (let i = 0; i < raw.length * 5; i++) {
    const val = [
      moment()
        .add(i * 1, "h")
        .toISOString(),
      Math.round(f(Math.random(), Math.random()) + Math.random() / 5),
      // Math.round(Math.random() * 3),
      // raw[i][1],
    ];
    datasets.push(val);
  }

  console.log(datasets.length);
  datasets.forEach((val, idx) => {
    if (idx <= datasets.length / 24) {
      console.log(val);
    }
  });
  datasets = getResampledData(datasets, "day");
  datasets.splice(0, 1);
  console.log(datasets.length);
  datasets.forEach((val, idx) => {
    console.log(val);
  });

  // datasets = [
  //   ["2021-03-09T17:33:24.104Z", 76],
  //   ["2021-03-10T17:33:24.109Z", 98],
  //   ["2021-03-11T17:33:24.112Z", 92],
  //   ["2021-03-12T17:33:24.115Z", 82],
  //   ["2021-03-13T17:33:24.120Z", 94],
  //   ["2021-03-14T17:33:24.123Z", 82],
  //   ["2021-03-15T17:33:24.126Z", 75],
  //   ["2021-03-16T17:33:24.129Z", 83],
  //   ["2021-03-17T17:33:24.133Z", 82],
  //   ["2021-03-18T17:33:24.136Z", 81],
  //   ["2021-03-19T17:33:24.140Z", 40],
  // ];

  const t1 = new timeseries(datasets);

  // undefined data if sample < 3
  const bestSettings1 = await t1.getBestSettings({
    sample: Math.round(datasets.length * 0.6),
    degree: Math.round(datasets.length * 0.6),
    method: ["ARMaxEntropy", "ARLeastSquare"],
  });

  const MSE1 = t1.model.regression_forecast({
    method: bestSettings1.method, // ARMaxEntropy or ARLeastSquare
    sample: bestSettings1.sample, // How many training data point for forecasting model
    degree: bestSettings1.degree,
    start: bestSettings1.sample + 1,
    n: Math.round(t1.model.data.length * 1.5) - bestSettings1.sample, // How many points to forecast
  });
  const chart1 = t1.model.chart({
    main: true,
    points: [{ color: "ff0000", point: bestSettings1.sample + 1, serie: 0 }],
  });
  const analysis1 = t1.model.regression_analysis();
  // const outliers1 = t1.model.outliers();

  console.log("===========================");

  const t2 = new timeseries(datasets);
  const bestSettings2 = await t2.getBestSettings({
    sample: Math.round(datasets.length * 0.6),
    degree: Math.round(datasets.length * 0.6),
    method: ["ARMaxEntropy", "ARLeastSquare"],
  });

  const MSE2 = t2.model.regression_forecast({
    method: bestSettings2.method, // ARMaxEntropy or ARLeastSquare
    sample: bestSettings2.sample, // How many training data point for forecasting model
    degree: bestSettings2.degree,
    start: bestSettings2.sample + 1, // must > 3
    n: Math.round(t2.model.data.length * 1.5) - bestSettings2.sample, // How many points to forecast
    growthSampleMode: true,
  });

  const chart2 = t2.model.chart({
    main: true,
    points: [{ color: "ff0000", point: bestSettings2.sample + 1, serie: 0 }],
  });
  const analysis2 = t2.model.regression_analysis();
  // const outliers2 = t2.model.outliers();

  const fetchData = {
    forecasted1: t1.model.data.map((val, idx) => {
      return { timestamp: val[0], value: val[1] };
    }),
    forecasted2: t2.model.data.map((val, idx) => {
      return { timestamp: val[0], value: val[1] };
    }),
    observed: datasets.map((val, idx) => {
      return { timestamp: val[0], value: val[1] };
    }),
  };

  const data = {
    bestSettings1,
    bestSettings2,
    fetchData,
    chart1,
    chart2,
    analysis1,
    analysis2,
    MSE1,
    MSE2,
    // outliers1,
    // outliers2,
  };

  console.log(data);

  return data;
};

// const timeseriesTest2 = async () => {
//   const raw = ts.adapter.complex({
//     cycle: 10,
//     inertia: 0.1,
//   });
//   let datasets = [];
//   for (let i = 0; i < raw.length * 1; i++) {
//     const data = {
//       timestamp: moment()
//         .add(i * 1, "h")
//         .toISOString(),
//       //value: Math.round(Math.random() * 3),
//       value: raw[i][1],
//     };
//     datasets.push(data);
//   }

//   console.log(datasets.length);
//   datasets.forEach((val, idx) => {
//     if (idx <= datasets.length / 24) {
//       console.log(val);
//     }
//   });
//   // datasets = getResampledData(datasets, "day");
//   // // datasets.splice(0, 1);
//   // console.log(datasets.length);
//   // datasets.forEach((val, idx) => {
//   //   console.log(val);
//   // });

//   // const data = await timeseriesTest();

//   const processedDatasets = datasets.map((val, idx) => val.value);
//   const processedDatasetsLen = processedDatasets.length;

//   const trainLen = Math.round(processedDatasets.length * 0.2);
//   const trainDatasets = processedDatasets.slice(0, trainLen);

//   const testLen = processedDatasets.length - trainLen;
//   const testDatasets = processedDatasets.slice(trainLen, testLen);

//   console.log({ processedDatasetsLen, trainLen, testLen });

//   const model = new ARIMA({
//     auto: true,
//     verbose: true,
//   });

//   model.train(trainDatasets);

//   const [preds, errors] = model.predict(testLen);

//   const predsLen = preds.length;
//   const errorsLen = errors.length;
//   console.log({ predsLen, errorsLen });

//   const forecastedDatasets = [];
//   const timeDiff = moment(datasets[1].timestamp).diff(datasets[0].timestamp);

//   for (let i = 0, len = trainLen + predsLen; i < len; i++) {
//     const data = { timestamp: null, value: null };
//     if (i < trainLen) {
//       data.timestamp = datasets[i].timestamp;
//       data.value = datasets[i].value;
//     } else {
//       data.timestamp = moment(forecastedDatasets[i - 1].timestamp)
//         .add(timeDiff, "ms")
//         .toISOString();
//       data.value = preds[i - trainLen];
//     }
//     forecastedDatasets.push(data);
//   }

//   const forecastedDatasetsLen = forecastedDatasets.length;
//   console.log({ forecastedDatasetsLen });

//   const fetchData = {
//     observed: datasets,
//     forecasted: forecastedDatasets,
//     forecastedCurrent: forecastedDatasets,
//   };

//   const data = {
//     fetchData,
//   };

//   return data;
// };

const routes = Router();

routes.get("/", async (req, res) => {
  const data = await timeseriesTest1();
  res.status(200).send(data);
});

export default routes;
