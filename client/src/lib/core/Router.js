import Navigo from 'navigo';

class Router {
  constructor(mainUrl, hash) {
    this.router = new Navigo(mainUrl, true, hash);
  }

  addRoute(path, f, hooks = {}) {
    this.router.on(path, f, hooks).resolve();
  }

  navigate(l) {
    this.router.navigate(l);
  }

  updatePageLinks() {
    this.router.updatePageLinks();
  }
}

export default Router;
