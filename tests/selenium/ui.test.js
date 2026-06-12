const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const app = require('../../src/app');

const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}`;

let server;
let driver;

beforeAll(async () => {
  app.resetTasks();
  server = app.listen(PORT);

  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1280,800'
  );

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}, 60000);

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
  if (server) {
    server.close();
  }
});

describe('Interface do Gerenciador de Tarefas (Selenium)', () => {
  test('deve carregar a página e exibir o título correto', async () => {
    await driver.get(BASE_URL);
    const title = await driver.getTitle();

    expect(title).toContain('Gerenciador de Tarefas');
  });

  test('deve adicionar uma nova tarefa pela interface', async () => {
    await driver.get(BASE_URL);

    const input = await driver.findElement(By.id('task-input'));
    await input.sendKeys('Comprar leite');

    const button = await driver.findElement(By.id('add-task-btn'));
    await button.click();

    const item = await driver.wait(
      until.elementLocated(By.xpath("//li[contains(., 'Comprar leite')]")),
      10000
    );

    expect(await item.getText()).toContain('Comprar leite');
  });

  test('deve marcar uma tarefa como concluída ao clicar no checkbox', async () => {
    const checkbox = await driver.findElement(By.css("#task-list li input[type='checkbox']"));
    await checkbox.click();

    await driver.wait(async () => {
      const li = await driver.findElement(By.xpath("//li[contains(., 'Comprar leite')]"));
      const classAttr = await li.getAttribute('class');
      return classAttr.includes('done');
    }, 10000);
  });
});