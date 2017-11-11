# jira-cards

Make printable cards from Jira issues.

## Get started

```bash
# clone the repo
$ git clone git@github.com:tstapleton/jira-cards.git
$ cd jira-cards

# use the specified version of Node
$ nvm use

# install dependencies
$ npm install
```

## Export issues from Jira

Export issues to CSV from the issue navigator in Jira. See their [working with search results](https://confluence.atlassian.com/jiracoreserver073/working-with-search-results-861257284.html) documentation for direction.

## Import issues into jira-cards

```bash
# should be in the jira-cards directory
# import the CSV file
$ npm run import /path/to/export/from/jira.csv
```

## Start up the server

```bash
$ npm start
```

Then open http://localhost:9830 in your browser to see your Jira cards! Print from the browser onto cardstock and enjoy.
