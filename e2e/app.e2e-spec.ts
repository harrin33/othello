import { OthelloPage } from './app.po';

describe('othello App', function() {
  let page: OthelloPage;

  beforeEach(() => {
    page = new OthelloPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
