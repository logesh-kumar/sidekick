import { useEffect, useState } from 'react';
import './App.css'; // Make sure to create this file for styles
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PropData {
  componentName: string;
  propName: string;
  fileName: string;
  line?: number;
}

const API_URL = 'http://localhost:4000';

function App() {
    const [data, setData] = useState<PropData[]>([]);

    // Fetch the JSON data
    useEffect(() => {
        fetch(`${API_URL}/data`)
            .then((response) => response.json())
            .then((data: PropData[]) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Handle click to open file in VSCode
    const handleClick = (fileName: string, line: number = 1) => {
        fetch(`${API_URL}/open-in-vscode?fileName=${encodeURIComponent(fileName)}&line=${line}`)
            .then((response) => response.text())
            .then((message) => console.log(message))
            .catch((error) => console.error('Error opening file:', error));
    };

    return (
        <div className="container">
            <h1>Component Prop Finder</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Prop</TableHead>
                        <TableHead>File</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} onClick={() => handleClick(item.fileName, item.line ?? 1)}>
                            <TableCell>{item.componentName}</TableCell>
                            <TableCell>{item.propName}</TableCell>
                            <TableCell>{item.fileName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default App;
