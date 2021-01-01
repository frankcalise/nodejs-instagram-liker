require("dotenv").config();

const webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  until = webdriver.until;

let numberOfPostsLiked = 0;
const MAX_POSTS_TO_LIKE = 2;

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

const driver = new webdriver.Builder().forBrowser("chrome").build();

driver.get("https://www.instagram.com/accounts/login/?hl=en").then(function () {
  driver
    .wait(webdriver.until.elementLocated(By.name("username")), 3000)
    .then(() => {
      driver
        .findElement(webdriver.By.name("username"))
        .sendKeys(`${process.env.INSTAGRAM_USERNAME}\t`)
        .then(() => {
          driver
            .findElement(webdriver.By.name("password"))
            .sendKeys(`${process.env.INSTAGRAM_PASSWORD}\n`)
            .then(() => {
              // dismiss saving password
              const notNowButton = By.xpath('//button[text()="Not Now"]');
              driver
                .wait(webdriver.until.elementLocated(notNowButton), 3000)
                .then(() => {
                  driver.findElement(notNowButton).click();
                  // dismiss notification popup

                  // SEARCH HASHTAG - BEGIN
                  driver
                    .navigate()
                    .to(
                      "https://www.instagram.com/explore/tags/beachbodyondemand/"
                    )
                    .then(async () => {
                      // most recent area
                      const firstMostRecentPost = By.xpath(
                        '//h2[text()="Most recent"]/following-sibling::div//a'
                      );
                      driver
                        .wait(
                          webdriver.until.elementLocated(firstMostRecentPost),
                          3000
                        )
                        .then(async () => {
                          driver.findElement(firstMostRecentPost).click();

                          // loop until we hit some limit
                          for (let i = 0; i < MAX_POSTS_TO_LIKE; i++) {
                            const likeButton = By.xpath(
                              '//article[@role="presentation"]/div[3]/section//button'
                            );
                            await driver.wait(webdriver.until.elementLocated(likeButton), 3000);
                            
                            await driver.findElement(likeButton).click();
                            await timer(500);

                            const nextButton = By.linkText("Next");
                            await driver.findElement(nextButton).click();
                              
                            numberOfPostsLiked = numberOfPostsLiked + 1;
                          }
                        });

                      // click like button
                      //article[@role="presentation"]/div[3]/section//button

                      // click next pagination button
                      // By.linkText("Next");
                    });

                  // SEARCH HASHTAG - END

                  // LOGOUT - BEGIN
                  // const avatarImage = By.xpath(
                  //   `//img[@alt="${process.env.INSTAGRAM_USERNAME}'s profile picture"]`
                  // );
                  // // click avatar image
                  // driver
                  //   .wait(webdriver.until.elementLocated(avatarImage), 3000)
                  //   .then(() => {
                  //     driver.findElement(avatarImage).click();
                  //     const logOutDiv = By.xpath('//div[text()="Log Out"]');
                  //     driver
                  //       .wait(
                  //         webdriver.until.elementLocated(logOutDiv),
                  //         3000
                  //       )
                  //       .then(() => {
                  //         driver.findElement(logOutDiv).click();
                  //       });
                  //   });
                  // LOGOUT - END
                });
            });
        });
    });
});
