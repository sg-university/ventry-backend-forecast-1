class Debugger {
  log(source, content) {
    console.log(`[${source}]`, content);
  }

  error(source, content) {
    console.error(`[${source}]`, content);
  }
}

export default new Debugger();
