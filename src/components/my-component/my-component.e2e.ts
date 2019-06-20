import { newE2EPage } from '@stencil/core/testing';
import { request } from 'https';

describe('my-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<my-component></my-component>');
    const element = await page.find('my-component');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<my-component></my-component>');
    const component = await page.find('my-component');
    const element = await page.find('my-component >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });

  it('can intercept request', async () => {
    const page = await newE2EPage();
    page.on('request', (request)=>{

      try {
        console.log(`request: ${request.url() }`)
        if (request.url().match(/server/)) {
          return;
        } else  if(request.url().match(/myurl/)) {
          console.log('match');
          request.respond({
            status: 200,
            contentType: 'text/html',
            body: "foo"
          });
        } else {
          console.log(`continue ${request.url()}`);
          request.continue().catch((reason) => {console.log(`can't continue because ${reason}`)});
        }
      } catch (err) {
        console.log(`caught ${err} for ${request.url()}`);
      }
      
    });
    await page.setRequestInterception(true);
    await page.setContent('<img src="./foo.png"></img>');
    // const element = await page.find('img');
  });
});
