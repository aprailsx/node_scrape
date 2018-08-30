var log4js = require("log4js");
const puppeteer = require("puppeteer");
// const jobs = require("./mongodb/jobsCollection");

module.exports = {
  anthemincJobs: function(){
    log4js.configure({
			appenders: {
				antheminc: {
				type: "file",
				filename: "jobs.log" }
			},
			categories: {
				default: {
					appenders: ["antheminc"],
					level: "info"
				}
			}
		});

    (async () => {
      const logger = log4js.getLogger("antheminc");

      const browser = await puppeteer.launch({
        headless: false
      });

      const page = await browser.newPage();

      await page.setViewport({
        width: 1366,
        height: 768
      });

      try
      {
  			await page.goto("http://careers.antheminc.com/search-jobs/");

        // Capture all job links on first page.
        let hrefs = await page.evaluate(() => {
  				 return Array.from(document.querySelectorAll("#widget-jobsearch-results-list > ol > li.job > ul.job-innerwrap > li.job-data.title > div.jobTitle > a")).map((val) => val.href);
  			});

        for (let iterator = 0; iterator < hrefs.length; iterator++)
        {
          await jobs.putJob("http://careers.antheminc.com/search-jobs/", hrefs[iterator]);
        }

        logger.info("%j", "page 1: " + hrefs);

        let liCount = 0;
        let pageIterator = 2;
        let nextPageFlag = true;

        // Iterate through pages of job list and capture job links.
        while (nextPageFlag)
        {
          await Promise.all([
              page.goto("http://careers.antheminc.com/search-jobs/?pg=" + pageIterator),
          ]);

          liCount = await page.$$eval("#widget-jobsearch-results-list > ol > li", li => li.length);

          if (liCount != 0)
          {
            hrefs = await page.evaluate(() => {
      				 return Array.from(document.querySelectorAll("#widget-jobsearch-results-list > ol > li.job > ul.job-innerwrap > li.job-data.title > div.jobTitle > a")).map((val) => val.href);
      			});

            for (let iterator = 0; iterator < hrefs.length; iterator++)
            {
              await jobs.putJob("http://careers.antheminc.com/search-jobs/", hrefs[iterator]);
            }

            logger.info("%j", "page " + pageIterator + ": " + hrefs);
          }
          else
          {
            nextPageFlag = false;
          }

          pageIterator++;
        }
      }
      catch (e)
      {
        console.log(e);
        logger.error("%j", e);
      }
      finally
      {
        // Close chromium browser to end crawling.
        await browser.close();
      }
    })();
  }
};
