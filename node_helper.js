const NodeHelper = require("node_helper")
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = NodeHelper.create({
  socketNotificationReceived: function(notification, payload) {
    if (notification === "MMM-tgwordoftheday-GET_WORD") {
      const url = "https://www.tagalog.com/word-of-the-day/";

      axios.get(url).then(({ data }) => {
        const $ = cheerio.load(data);
  
        const container = $(".entry--1qTEOKKt")[0];

        const word = $(container).find("h3");
        const translation = word.next();

        const exampleContainer = $(container).find('ol').first().children()
        const firstExample = exampleContainer.first().children()
        const secondExample = exampleContainer.next().children()

        const examples = {
          one: {
            spanish: firstExample.first().text(),
            english: firstExample.next().text()
          },
          two: {
            spanish: secondExample.first().text(),
            english: secondExample.next().text()
          }
        }
  
        const processed = { 
          word: word.text(),
          translation: translation.text(),
          examples: examples
        }

        this.sendSocketNotification("MMM-eswordoftheday-RETURN_WORD", processed)
      })
    }
  }
})
