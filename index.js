import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';

// May 19, 2025 to July 18, 2025 ONLY
const startDate = moment('2025-05-19');
const endDate = moment('2025-07-18');
const totalDays = endDate.diff(startDate, 'days') + 1;

let allCommits = [];

// Create 5-15 commits for EACH day
for (let i = 0; i < totalDays; i++) {
    const commitsPerDay = random.int(5, 15);
    const currentDay = startDate.clone().add(i, 'days');
    
    for (let j = 0; j < commitsPerDay; j++) {
        allCommits.push(
            currentDay.clone()
                .hour(random.int(9, 22))
                .minute(random.int(0, 59))
                .format()
        );
    }
}

console.log(`Creating ${allCommits.length} commits from May 19 to July 18, 2025 (${totalDays} days)`);

const makeCommit = (index) => {
    if (index >= allCommits.length) {
        return simpleGit().push(['--force', 'origin', 'main'])
            .then(() => console.log('✅ Done! All commits pushed.'))
            .catch(err => console.error('Push failed:', err));
    }
    
    const date = allCommits[index];
    const data = { date: date };
    
    if (index % 50 === 0) {
        console.log(`Progress: ${index}/${allCommits.length}`);
    }
    
    jsonfile.writeFile(path, data)
        .then(() => simpleGit().add([path]).commit(date, {'--date': date}))
        .then(() => makeCommit(index + 1))
        .catch(err => console.error('Error:', err));
};

makeCommit(0);