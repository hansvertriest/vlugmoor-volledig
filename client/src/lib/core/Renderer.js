class Renderer {
    constructor(element, router) {
      this.element = element;
      this.router = router;
    }
  
    render(html) {
      this.element.innerHTML = html;
      this.router.updatePageLinks();
    }
  }
  
  export default Renderer;