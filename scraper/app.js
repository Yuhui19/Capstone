const express = require('express');
const { Kafka } = require('kafkajs')
const hostname = 'localhost';
const port = 3000;
const cors = require('cors')
const app = express()

app.use(cors())


app.get('/test', function (req, res, next) {
  res.json({
    "data": [
        {
            "id": "887fde6b-406b-4253-92e1-42630b76f3b5",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Graduate Software Developer",
            "company": "swipejobs",
            "place": "Sydney, New South Wales, Australia",
            "date": "2020-07-12",
            "link": "https://au.linkedin.com/jobs/view/graduate-software-developer-at-swipejobs-1945007290?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=4&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Entry level",
            "function": "Engineering, Information Technology",
            "employmentType": "Full-time",
            "industries": "Information Technology and Services, Computer Software, Internet"
        },
        {
            "id": "41dffd11-11fe-4fb9-bc8a-39c69f6afbf0",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Graduate Software Engineers",
            "company": "Graduate Recruitment Bureau (GRB)",
            "place": "London, England, United Kingdom",
            "date": "2020-07-29",
            "link": "https://uk.linkedin.com/jobs/view/graduate-software-engineers-at-graduate-recruitment-bureau-grb-2005485126?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=6&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Entry level",
            "function": "Engineering, Information Technology",
            "employmentType": "Full-time",
            "industries": "Information Technology and Services, Computer Software, Staffing and Recruiting"
        },
        {
            "id": "fe35e68f-c5b0-4cbc-9707-3c1c89d7333c",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Graduate Software Engineer",
            "company": "Cisco",
            "place": "Lysaker, Akershus, Norway",
            "date": "2020-08-30",
            "link": "https://no.linkedin.com/jobs/view/graduate-software-engineer-at-cisco-2015090810?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=7&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Not Applicable",
            "function": "Engineering, Information Technology",
            "employmentType": "Full-time",
            "industries": "Computer Hardware, Computer Software, Computer Networking"
        },
        {
            "id": "c1915c2b-6527-4df0-b006-0b1041f3f0fe",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Software Engineer- (Graduate Program)",
            "company": "Amdocs",
            "place": "Plano, TX",
            "date": "2020-07-22",
            "link": "https://www.linkedin.com/jobs/view/software-engineer-graduate-program-at-amdocs-1993073833?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=2&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Entry level",
            "function": "Engineering, Information Technology",
            "employmentType": "Internship",
            "industries": "Information Technology and Services, Computer Software, Telecommunications"
        },
        {
            "id": "17cdccb9-9156-432e-9614-f3b714489555",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Software Engineer - University Graduate",
            "company": "PayPal",
            "place": "San Francisco, CA",
            "date": "2020-08-11",
            "link": "https://www.linkedin.com/jobs/view/software-engineer-university-graduate-at-paypal-2147928361?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=1&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Not Applicable",
            "function": "Engineering, Information Technology",
            "employmentType": "Full-time",
            "industries": "Computer Software, Financial Services, Internet"
        },
        {
            "id": "89b789d7-4b6f-4b71-838c-e5b2a19c8aad",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Software Engineering Graduate",
            "company": "Dell",
            "place": "Cork, Cork, Ireland",
            "date": "2020-09-01",
            "link": "https://ie.linkedin.com/jobs/view/software-engineering-graduate-at-dell-2011178015?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=3&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Not Applicable",
            "function": "Information Technology, Engineering",
            "employmentType": "Full-time",
            "industries": "Computer Hardware, Computer Software, Information Technology and Services"
        },
        {
            "id": "e5fa6945-3340-4e33-8623-6e3e405f14de",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Graduate software developer",
            "company": "Softwire",
            "place": "London, England, United Kingdom",
            "date": "2020-07-28",
            "link": "https://uk.linkedin.com/jobs/view/graduate-software-developer-at-softwire-2004468364?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=5&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Entry level",
            "function": "Engineering, Information Technology",
            "employmentType": "Full-time",
            "industries": "Marketing and Advertising, Information Technology and Services, Computer Software"
        },
        {
            "id": "66ef2309-fce3-4124-b944-e941af741bf4",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Software Engineer - New College Graduate",
            "company": "NVIDIA",
            "place": "Changping District, Beijing, China",
            "date": "2020-09-04",
            "link": "https://cn.linkedin.com/jobs/view/software-engineer-new-college-graduate-at-%E8%8B%B1%E4%BC%9F%E8%BE%BE-1951305324?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=10&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Not Applicable",
            "function": "Engineering",
            "employmentType": "Full-time",
            "industries": "Computer Hardware, Computer Software, Consumer Electronics"
        },
        {
            "id": "0d7389ab-c2b1-422e-80e0-ee51eebac914",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "New Grads 2020",
            "company": "Fortinet",
            "place": "Sunnyvale, CA",
            "date": "2020-08-25",
            "link": "https://www.linkedin.com/jobs/view/new-grads-2020-at-fortinet-1990187867?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=8&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Not Applicable",
            "function": "Other",
            "employmentType": "Full-time",
            "industries": "Information Technology and Services, Computer & Network Security, Computer Software"
        },
        {
            "id": "f0d61404-8726-42ee-8697-92e1b6423f47",
            "query": "software graduate",
            "location": "Worldwide",
            "title": "Software Engineer - New Grad (Summer 2021)",
            "company": "Roblox",
            "place": "San Mateo, CA",
            "date": "2020-09-03",
            "link": "https://www.linkedin.com/jobs/view/software-engineer-new-grad-summer-2021-at-roblox-2011292610?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=9&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
            "senorityLevel": "Entry level",
            "function": "Engineering, Information Technology",
            "employmentType": "Full-time",
            "industries": "Information Technology and Services, Computer Software, Internet"
        }
    ]
})
})
 
app.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
})




/*


// create Kafka instance and configure this instance
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kaf1-srv:9092']
})

// create a producer client instance
const producer = kafka.producer()



const run = async () => {
  // Producing
  await producer.connect()
  // await producer.send({
  //   topic: 'test-topic',
  //   messages: [
  //     { value: 'Hello KafkaJS user!' },
  //   ],
  // })
 
  // Consuming
  // await consumer.connect()
  // await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
 
  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     console.log({
  //       partition,
  //       offset: message.offset,
  //       value: message.value.toString(),
  //     })
  //   },
  // })
}
 
// run().catch(console.error)



const { LinkedinScraper, events } = require("linkedin-jobs-scraper");

(async () => {
  // Programatically disable logger
  setTimeout(() => LinkedinScraper.disableLogger(), 5000);

  // Each scraper instance is associated with one browser.
  // Concurrent queries will be runned on different pages within the same browser instance.
  const scraper = new LinkedinScraper({
    headless: true,
    slowMo: 100 // used to be 10
  });

  var res = {
    table: []
  };

  // Listen for custom events
  scraper.on(
    events.scraper.data,
    ({
      query,
      location,
      link,
      title,
      company,
      place,
      date,
      description,
      senorityLevel,
      jobFunction,
      employmentType,
      industries
    }) => {
      res.table.push({
        query: query,
        location: location,
        title: title,
        company: company,
        place: place,
        date: date,
        // description: description,
        link: link,
        senorityLevel: senorityLevel,
        function: jobFunction,
        employmentType: employmentType,
        industries: industries
      });
    }
  );

  scraper.on(events.scraper.error, err => {
    console.error(err);
  });
  scraper.on(events.scraper.end, async () => {
    console.log("All done!");
    // let fs = require("fs");
    // let time = '{"time" : ' + '"' + new Date().toLocaleString() + '",';
    // console.log(time + '"data" : ' + JSON.stringify(res.table) + "}");
    // fs.writeFile(
    //   "linkedin_output.json",
    //   time + '"data" : ' + JSON.stringify(res.table) + "}",
    //   "utf8",
    //   () => {}
    // );

    let time = '{"time" : ' + '"' + new Date().toLocaleString() + '",';
    await producer.connect()
    console.log("producer connect to kafka");
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: time + '"data" : ' + JSON.stringify(res.table) + "}" },
      ],
    })
    console.log("producer sends message to kafka");

  });

  // Listen for puppeteer specific browser events
  scraper.on(events.puppeteer.browser.targetcreated, () => {});
  scraper.on(events.puppeteer.browser.targetchanged, () => {});
  scraper.on(events.puppeteer.browser.targetdestroyed, () => {});
  scraper.on(events.puppeteer.browser.disconnected, () => {});

  // This will be executed on browser side
  const descriptionProcessor = () =>
    document
      .querySelector(".description__text")
      .innerText.replace(/[\s\n\r]+/g, " ")
      .trim();

  // Run queries concurrently
  await Promise.all([
    scraper.run({
      query: "software graduate", 
      options: {
        location: ["United States"],
        limit: 10
      }
    }),
    // scraper.run("software grad", "United States", {
    //   paginationMax: 2
    // }),
    // scraper.run("software college", "United States", {
    //   paginationMax: 2
    // }),
    // scraper.run("software university", "United States", {
    //   paginationMax: 2
    // }),
    // scraper.run("entry software", "United States", {
    //   paginationMax: 2
    // }),
    // scraper.run("junior developer", "United States", {
    //   paginationMax: 2
    // })
  ]);

  // Close browser
  await scraper.close();
})();

*/








// scrape();

// var interval = setInterval(scrape, 20000);







// const puppeteer = require('puppeteer');
 
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   // await page.screenshot({path: 'example.png'});
//   console.log("go to the page!")
//   await browser.close();
// })();