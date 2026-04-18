const { calculateATSScore } = require('./utils/atsScoring');

const sampleResume = `
Ashish Kumar
ashish@example.com
(555) 123-4567

Experience
Senior Software Engineer - Tech Corp
Jan 2018 - Present
- Worked with React, Node.js, and MongoDB.
- Managed AWS infrastructure.

Education
Bachelor of Technology in Computer Science
XYZ University

Skills
JavaScript, Python, Docker, Kubernetes, SQL, Git, Agile, Scrum
`;

console.log('Testing ATS Scoring with sample valid resume...');
const result = calculateATSScore(sampleResume);

console.log('\n--- Result ---');
console.log('Total Score:', result.totalScore);
console.log('Breakdown:', JSON.stringify(result.breakdown, null, 2));

if (result.totalScore > 50) {
    console.log('\n✅ Scoring logic is WORKING.');
    console.log('If you still see 0s in the app, the issue is PDF PARSING (text not being extracted correctly).');
} else {
    console.log('\n❌ Scoring logic is BROKEN.');
}
