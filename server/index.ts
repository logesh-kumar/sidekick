import express,  { type Request, type Response } from 'express';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
// import findProps from './findProps';
// import type { FileInfo, API } from 'jscodeshift';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// app.post('/analyze', (req: Request, res: Response) => {
//     const { sourceDir } = req.body;

//     if (!sourceDir) {
//         res.status(400).json({ error: 'Filepath is required' });
//         return;
//     }

//     // Create a temporary file to store the results
//     const tempOutputFile = path.join(__dirname, 'temp_componentPropsResults.json');

//     try {
//         console.log('Analyzing file:', sourceDir);
        

//         const api: API = {
//             j: require('jscodeshift'),
//             jscodeshift: require('jscodeshift'),
//             stats: () => {},
//             report: () => {}
//         };

//         //findProps({ srcDir: sourceDir, api, tempOutputFile });

//         // Read the results
//         if (fs.existsSync(tempOutputFile)) {
//             const results = JSON.parse(fs.readFileSync(tempOutputFile, 'utf8'));
//             fs.unlinkSync(tempOutputFile); // Delete the temporary file
//             res.json(results);
//         } else {
//             res.json([]);
//         }
//     } catch (error) {
//         console.error('Error analyzing file:', error);
//         res.status(500).json({ error: 'An error occurred while analyzing the file' });
//     }
// });


// jsut serve the componentPropsResults.json file
app.get('/data', (req: Request, res: Response) => {
    const componentPropsResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'componentPropsResults.json'), 'utf8'));
    res.json(componentPropsResults);
});

// New route to open file in VSCode
app.get('/open-in-vscode', (req: Request, res: Response) => {
    const { fileName, line } = req.query;

    if (!fileName) {
        res.status(400).json({ error: 'fileName is required' });
        return;
    }

    const command = `code -g "${fileName}:${line || 1}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening file in VSCode: ${error}`);
            return res.status(500).json({ error: 'Failed to open file in VSCode' });
        }
        res.send('File opened in VSCode');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
