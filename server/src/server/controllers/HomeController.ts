import { NextFunction, Request, Response } from 'express';

class HomeController {
  public index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<any> | void {
    const sections = [
      {
        title: 'Hoi',
        theme: 'green',
        slant: 'slant__shape-1',
        left: {
          background: {
            url:
              'https://www.shopthedot.eu/static/media/jongeninweinkelmand.5287b070.jpg',
            position: 'center right',
          },
          content: '',
        },
        right: {
          content: {
            text: '',
            type: '',
          },
        },
      },
      {
        title: 'Hoi',
        theme: 'red',
        slant: 'slant__shape-2',
        left: {},
        right: {
          background: {
            url: 'https://www.shopthedot.eu/static/media/kleren.3e5685b5.jpg',
            position: 'center left',
          },
          content: '',
        },
      },
      {
        title: 'Hoi',
        theme: 'purple',
        slant: 'slant__shape-1',
        left: {
          background: {
            url: 'https://www.shopthedot.eu/static/media/planet.c2f0805e.jpg',
            position: 'center center',
          },
          content: '',
        },
        right: {},
      },
      {
        title: 'Hoi',
        theme: 'green',
        slant: 'slant__shape-2',
        left: {},
        right: {
          background: {
            url:
              'https://www.shopthedot.eu/static/media/tweemensenwinkelmand.3c334d6e.jpg',
            position: 'center left',
          },
          content: '',
        },
      },
    ];
    res.render('pages/home', { sections });
  }
}

export default HomeController;
