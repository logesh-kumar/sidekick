const fs = require('fs');
const path = require('path');

// List of props to search for
const propsToFind = ['fullName', 'firstName', 'lastName', 'user'];

module.exports = function (fileInfo: any, api: any) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    const results: any[] = [];

    // Find JSX elements where any of the props are passed as variables
    root.find(j.JSXElement)
        .forEach((path: any) => {
           // get the element
            const element = path.node;
            // get the attributes
            const attributes = element.openingElement.attributes;
            // get the component name
            const componentName = element.openingElement.name.name;

            // iterate over the attributes and check if they are JSX attributes and have a value that is a variable
            attributes?.forEach((attr: any) => {
                if (j.JSXAttribute.check(attr) && j.JSXExpressionContainer.check(attr.value)) {
                    const propName = attr.name.name;
                    if (propsToFind.includes(propName)) {
                        // Collect the result in the results array
                        results.push({
                            fileName: fileInfo.path,
                            componentName: componentName,
                            propName: propName
                        });
                    }
                }
            });
        });

    // Write results to a JSON file (append mode)
    if (results.length > 0) {
        const outputFile = path.join(__dirname, 'componentPropsResults.json');
        const existingResults = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile, 'utf8')) : [];
        const combinedResults = existingResults.concat(results);

        fs.writeFileSync(outputFile, JSON.stringify(combinedResults, null, 2));
    }

    return null;
};
