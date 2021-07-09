const { Builder, By, Key, until, Actions } = require("selenium-webdriver");

class App {
  constructor() {
    this.run();
  }

  async run() {
    const driver = await new Builder()
      .forBrowser("chrome")
      .usingServer("http://localhost:4444/wd/hub")
      .build();
    try {
      await driver.get(
        "https://www.skyfrog.net/toa/Views/Employee/#initialize:0"
      );
      await driver
        .findElement(By.id("txt-companycode-inputEl"))
        .sendKeys("C200039");
      await driver.findElement(By.id("txt-username-inputEl")).sendKeys("Kss");
      await driver
        .findElement(By.id("txt-password-inputEl"))
        .sendKeys("new14629");
      await driver.findElement(By.id("submit_login")).click();

      const ship_tab = await driver.wait(
        until.elementLocated(By.xpath("//a/em/span/span[text()='Shipment']")),
        10000
      );
      await driver.wait(
        until.elementIsNotVisible(driver.findElement(By.id("loading-mask"))),
        10000
      );

      ship_tab.click();

      const filterBtn = await driver.wait(
        until.elementLocated(By.xpath('//button[@id="ext-gen373"]'))
      );
      await driver.executeScript(
        `document.getElementById('ext-gen373').click()`
      );

      const vehicle = await driver.findElement(
        By.xpath(`//ul[@class="x-menu-list"]/li/a/span[text()="Vehicle"]`)
      );
      await vehicle.click();
      const search = await driver.findElement(By.id("search-shipment-view"));
      await search.click();
      await search.sendKeys("Draft", Key.RETURN);
      let count = 0;
      while (true) {
        try {
          const form = await driver.findElement(By.id("window-shipmentform"));
          console.log("form displayed", form.isDisplayed());
          if (await form.isDisplayed()) {
            await driver.wait(
              until.elementIsNotVisible(
                driver.findElement(By.id("window-shipmentform"))
              ),
              50000
            );
          }
        } catch {}

        const found = await driver.findElements(
          By.xpath("//td/div[text() = 'Draft']")
        );
        if (found.length > 0) {
          console.log(found);
          found.forEach(async (each) => {
            await driver.actions().doubleClick(each).perform();
            try {
              await driver
                .findElement(By.xpath('//button[text()="OK"]'))
                .click();
            } catch (e) {}
          });
        } else {
          console.log("not found : ", count++);
        }
        await search.sendKeys(Key.RETURN);
      }
    } catch (err) {
      console.log("failed :", err);
    }
  }
}

new App();
