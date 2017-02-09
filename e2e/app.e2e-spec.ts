import { TestngPage } from './app.po';

describe('testng App', function() {
  let page: TestngPage;

  beforeEach(() => {
    page = new TestngPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
