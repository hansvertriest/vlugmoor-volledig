import Renderer from './core/Renderer';
import Router from './core/Router';

class App {
    static initCore ({mainUrl, hash, element}) {
        this._router = new Router(mainUrl, hash);
        this._renderer = new Renderer(element, this.router);
    }

    static get router() {
        return this._router;
    }

    static get renderer() {
        return this._renderer;
    }

    static render(html) {
        if (!this._renderer) throw new Error('App core not initialized!!');
        this._renderer.render(html);
    }

}

export default App;