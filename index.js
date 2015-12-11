var postcss = require('postcss');

module.exports = postcss.plugin('assemble-grid', function (options) {
    return function (css) {
        options = options || {};

        css.walkRules(function (rule) {

            // Function to change a decimal to a %
            var toPercent = function convertToPercent(fraction) {
                return (fraction * 100) + '%';
            };

            // ASSEMBLE GRID
            rule.walkDecls(function (decl, i) {
                var value = decl.value,
                    valueArray = value.split(' '),
                    property = decl.prop,
                    calcPercent;

                /////////////////////////
                ///// assemble-grid /////
                /////////////////////////
                if (property.match(/^assemble-grid$/gi) !== null) {

                    ///// Check all options to see if they are valid.

                    // Detect if 1st value exists and is a fraction, a number value, or 'fit'.
                    // The first value sets the width of each cell.
                    var firstValueTest = parseInt(valueArray[0].replace(/[^0-9\.]+/g, ''));

                    if (isNaN(firstValueTest)) {
                        if (valueArray[0] == 'fit') {

                        } else {
                            console.log('Assemble Grid Error: The fist value in assemble-grid sets the width of each cell. It must be a fraction, a number value (300px), or "fit". It currently is "' + valueArray[0] + '".');
                            return;
                        }
                    } else if (valueArray[0].indexOf('/') === -1) {

                    } else {
                        // Get decimal value from option 1.
                        var mathDone = eval(valueArray[0]);

                        // Convert decimal to a %.
                        var percent = toPercent(mathDone);
                        calcPercent = percent;
                    }

                    // Detect if 2nd exists and is a number.
                    // The second value sets the gutter width.
                    if (valueArray[1] !== undefined) {
                        var secondValueTest = parseInt(valueArray[1].replace(/[^0-9\.]+/g, ''));
                        if (valueArray[1] == '_') {

                        } else if(isNaN(secondValueTest)) {
                            console.log('Assemble Grid Error: Second value in assemble-grid sets the gutter width. It must be a number value like "30px". It currently is "' + valueArray[1] + '".');
                            return;
                        }
                    }

                    // Detect if 3nd value exists and is a number.
                    // The third value sets the width of the grid and centers it.
                    if (valueArray[2] == '_') {

                    } else if(valueArray[2] !== undefined) {
                        var thirdValueTest = parseInt(valueArray[2].replace(/[^0-9\.]+/g, ''));
                        if (isNaN(thirdValueTest)) {
                            console.log('Assemble Grid Error: Third value in assemble-grid sets the width of the grid and centers it. It must be a number value like "800px". It currently is "' + valueArray[2] + '".');
                            return;
                        }
                    }

                    // Detect if 4th value is top bottom or center.
                    // The fourth value sets the alignment of each cell in the grid.
                    if (valueArray[3] == '_') {

                    } else if (valueArray[3] !== 'top' && valueArray[3] !== 'bottom' && valueArray[3] !== 'center' && valueArray[3] !== undefined) {
                        console.log('Assemble Grid Error: Fouth value in assemble-grid sets the alginment. It must be top, bottom, or center. It currently is "' + valueArray[3] + '".');
                        return;
                    }

                    // Detect if 5th value is true or false.
                    // The fifth value will add box-sizing: border-box if set to true.
                    if (valueArray[4] !== 'false' && valueArray[4] !== 'true' && valueArray[4] !== undefined) {
                        console.log('Assemble Grid Error: Fifth value in assemble-grid adds box-sizing: border-box; if set to true. It must be true or false. It currently is "' + valueArray[4] + '".');
                        return;
                    }

                    ///// All options passed. Lets build some CSS.

                    // Main block css.
                    decl.cloneBefore({ prop: 'display',  value: 'flex' });
                    decl.cloneBefore({ prop: 'margin',  value: '0' });
                    decl.cloneBefore({ prop: 'padding',  value: '0' });
                    decl.cloneBefore({ prop: 'list-style',  value: 'none' });
                    decl.cloneBefore({ prop: 'flex-wrap',  value: 'wrap' });

                    // If we have gutters offset the grid.
                    if (valueArray[1] !== '_' && valueArray[1] !== undefined) {
                        if (valueArray[2] == '_' || valueArray[2] === undefined) {
                            decl.cloneBefore({ prop: 'margin-left',  value: '-' + valueArray[1] });
                        }
                    }

                    // If we have fixed width set the width and center the grid.
                    if (valueArray[2] !== '_' && valueArray[2] !== undefined) {
                        decl.cloneBefore({ prop: 'max-width',  value: valueArray[2] });
                        decl.cloneBefore({ prop: 'margin',  value: '0 auto !important' });
                    }

                    // If align-items is set add the alignment.
                    if (valueArray[3] !== '_' && valueArray[3] !== undefined) {
                        if (valueArray[3] == 'top') {
                            decl.cloneBefore({ prop: 'align-items',  value: 'flex-start' });
                        } else if (valueArray[3] == 'bottom') {
                            decl.cloneBefore({ prop: 'align-items',  value: 'flex-end' });
                        } else {
                            decl.cloneBefore({ prop: 'align-items',  value: 'center' });
                        }
                    }

                    // Child block css.
                    var origRule = decl.parent,
                        ruleSelectorsChild = origRule.selectors,
                        newRuleChild,
                        gutterHalfType;

                    if (valueArray[1] !== undefined) {
                        var gutterHalf = parseInt(valueArray[1].replace(/[^0-9\.]+/g, ''))/2,
                            gutterType = valueArray[1].replace(/[^a-z\.]+/g, '');

                        gutterHalfType = gutterHalf + gutterType;
                    }

                    ruleSelectorsChild = ruleSelectorsChild.map(function(ruleSelector){
                        return ruleSelector + ' > *';
                    }).join(',\n');

                    newRuleChild = origRule.cloneAfter({
                        selector: ruleSelectorsChild
                    }).removeAll();

                    newRuleChild.append(
                        'display: ' + 'flex;'
                    );

                    // Width set to fit or percent.
                    if (valueArray[0] == 'fit') {
                        newRuleChild.append(
                            'flex: ' + '1;'
                        );
                    } else if (calcPercent === undefined) {
                        newRuleChild.append(
                            'flex: ' + '0 0 ' + valueArray[0] +';'
                        );
                    } else{
                        newRuleChild.append(
                            'flex: ' + '0 0 ' + calcPercent +';'
                        );
                    }

                    // Add in gutters if we have them.
                    if (valueArray[1] !== '_' && valueArray[1] !== undefined) {
                        if (valueArray[2] == '_' || valueArray[2] === undefined) {
                            newRuleChild.append(
                                'margin-bottom: ' + valueArray[1] + ';' +
                                'padding-left: ' + valueArray[1] + ';'
                            );
                        }
                    }

                    // Divide the gutter by two and put the space on the sides if we are centering the grid.
                    if (valueArray[2] !== '_' && valueArray[2] !== undefined) {
                        newRuleChild.append(
                            'margin-bottom: ' + valueArray[1] + ';' +
                            'padding-left: ' + gutterHalfType + ';' +
                            'padding-right: ' + gutterHalfType + ';'
                        );
                    }

                    // Add border-box to the grid cells if option is set to true.
                    if (valueArray[4] == 'true' && valueArray[4] !== undefined) {
                        newRuleChild.append(
                            'box-sizing: ' + 'border-box;'
                        );
                    }

                    // Remove the original declaration
                    decl.remove();
                }
            });

            //////////////////////////////
            ///// assemble-grid-cell /////
            //////////////////////////////
            rule.walkDecls(function (decl, i) {
                var value = decl.value,
                    valueArray = value.split(' '),
                    property = decl.prop,
                    calcPercent;

                if (property.match(/^assemble-grid-cell$/gi) !== null) {

                    // Detect if 1st value exists and is a fraction or number value.
                    // The first value set the width of a single grid cell.
                    var firstValueTest = parseInt(valueArray[0].replace(/[^0-9\.]+/g, ''));

                    if (valueArray[0] == '_') {

                    } else if (isNaN(firstValueTest)) {
                        console.log('Assemble Grid Error: The fist value in assemble-cell sets the width of a single cell. It must be a fraction or a number value (300px). It currently is "' + valueArray[0] + '".');
                        return;
                    } else if (valueArray[0].indexOf('/') === -1) {
                        decl.cloneBefore({ prop: 'flex',  value: '0 0 ' + valueArray[0]});
                    } else {
                        // Get decimal value from option 1.
                        var mathDone = eval(valueArray[0]);

                        // Convert decimal to a %.
                        var percent = toPercent(mathDone);
                        calcPercent = percent;

                        decl.cloneBefore({ prop: 'flex',  value: '0 0 ' + calcPercent});
                    }


                    // If align-items is set add the alignment.
                    if (valueArray[1] !== 'top' && valueArray[1] !== 'bottom' && valueArray[1] !== 'center' && valueArray[1] !== undefined) {
                        console.log('Assemble Grid Error: The second value in assemble-cell sets the alginment. It must be top, bottom, or center. It currently is "' + valueArray[1] + '".');
                        return;
                    } else {
                        if (valueArray[1] == 'top') {
                            decl.cloneBefore({ prop: 'align-self',  value: 'flex-start' });
                        } else if (valueArray[1] == 'bottom') {
                            decl.cloneBefore({ prop: 'align-self',  value: 'flex-end' });
                        } else if (valueArray[1] == 'center'){
                            decl.cloneBefore({ prop: 'align-self',  value: 'center' });
                        }
                    }

                    // Remove the original declaration
                    decl.remove();

                }
            });

            ////////////////////////////
            ///// assemble-grid-mq /////
            ////////////////////////////
            rule.walkDecls(function (decl, i) {
                var value = decl.value,
                    valueArray = value.split(' '),
                    property = decl.prop;

                if (property.match(/^assemble-grid-mq$/gi) !== null) {

                    ///// Check all options to see if they are valid.

                    // Detect if 1st value exists and is a fraction, a number value, or 'fit'.
                    // The first value sets the width of each cell.
                    var firstValueTest = parseInt(valueArray[0].replace(/[^0-9\.]+/g, ''));

                    if (valueArray[0] == '_') {

                    } else if (isNaN(firstValueTest)) {
                        if (valueArray[0] == 'fit') {

                        } else {
                            console.log('Assemble Grid Error: The fist value in assemble-mq-grid sets the width of each cell. It must be a fraction, a number value (300px), or "fit". It currently is "' + valueArray[0] + '".');
                            return;
                        }
                    } else if (valueArray[0].indexOf('/') === -1) {

                    } else {
                        // Get decimal value from option 1.
                        var mathDone = eval(valueArray[0]);

                        // Convert decimal to a %.
                        var percent = toPercent(mathDone);
                        calcPercent = percent;
                    }

                    // Detect if 2nd exists and is a number.
                    // The second value sets the gutter width.
                    if (valueArray[1] !== undefined) {
                        var secondValueTest = parseInt(valueArray[1].replace(/[^0-9\.]+/g, ''));
                        if (valueArray[1] == '_') {

                        } else if(isNaN(secondValueTest)) {
                            console.log('Assemble Grid Error: Second value in assemble-mq-grid sets the gutter width. It must be a numebr like "30px". It currently is "' + valueArray[1] + '".');
                            return;
                        }
                    }

                    // Detect if 3nd value exists and is a number.
                    // The third value sets the width of the grid and centers it.
                    if (valueArray[2] == '_') {

                    } else if(valueArray[2] !== undefined) {
                        var thirdValueTest = parseInt(valueArray[2].replace(/[^0-9\.]+/g, ''));
                        if (isNaN(thirdValueTest)) {
                            console.log('Assemble Grid Error: Third value in assemble-mq-grid sets the width of the grid and centers it. It must be a number like "800px". It currently is "' + valueArray[2] + '".');
                            return;
                        }
                    }

                    // Detect if 4th value is top bottom or center.
                    // The fourth value sets the alignment of each cell in the grid.
                    if (valueArray[3] == '_') {

                    } else if (valueArray[3] !== 'top' && valueArray[3] !== 'bottom' && valueArray[3] !== 'center' && valueArray[3] !== undefined) {
                        console.log('Assemble Grid Error: Fouth value in assemble-mq-grid sets the alginment. It must be top, bottom, or center. It currently is "' + valueArray[3] + '".');
                        return;
                    }

                    ///// All options passed. Lets build some CSS.

                    // If we have gutters offset the grid.
                    if (valueArray[1] !== '_' && valueArray[1] !== undefined) {
                        if (valueArray[2] == '_' || valueArray[2] === undefined) {
                            decl.cloneBefore({ prop: 'margin-left',  value: '-' + valueArray[1] });
                        }
                    }

                    // If we have fixed width set the width and center the grid.
                    if (valueArray[2] !== '_' && valueArray[2] !== undefined) {
                        decl.cloneBefore({ prop: 'max-width',  value: valueArray[2] });
                        decl.cloneBefore({ prop: 'margin',  value: '0 auto !important' });
                    }

                    // If align-items is set add the alignment.
                    if (valueArray[3] !== '_' && valueArray[3] !== undefined) {
                        if (valueArray[3] == 'top') {
                            decl.cloneBefore({ prop: 'align-items',  value: 'flex-start' });
                        } else if (valueArray[3] == 'bottom') {
                            decl.cloneBefore({ prop: 'align-items',  value: 'flex-end' });
                        } else {
                            decl.cloneBefore({ prop: 'align-items',  value: 'center' });
                        }
                    }

                    // Child block css.
                    var origRule = decl.parent,
                        ruleSelectorsChild = origRule.selectors,
                        newRuleChild,
                        gutterHalfType;

                    if (valueArray[1] !== undefined) {
                        var gutterHalf = parseInt(valueArray[1].replace(/[^0-9\.]+/g, ''))/2,
                            gutterType = valueArray[1].replace(/[^a-z\.]+/g, '');

                        gutterHalfType = gutterHalf + gutterType;
                    }

                    ruleSelectorsChild = ruleSelectorsChild.map(function(ruleSelector){
                        return ruleSelector + ' > *';
                    }).join(',\n');

                    newRuleChild = origRule.cloneAfter({
                        selector: ruleSelectorsChild
                    }).removeAll();

                    // Width set to fit or percent.
                    if (valueArray[0] == 'fit') {
                        newRuleChild.append(
                            'flex: ' + '1 !important;'
                        );
                    } else if (valueArray[0] == '_') {

                    } else if (calcPercent === undefined) {
                        newRuleChild.append(
                            'flex: ' + '0 0 ' + valueArray[0] +' !important;'
                        );
                    } else{
                        newRuleChild.append(
                            'flex: ' + '0 0 ' + calcPercent +' !important;'
                        );
                    }

                    // Add in gutters if we have them.
                    if (valueArray[1] !== '_' && valueArray[1] !== undefined) {
                        if (valueArray[2] == '_' || valueArray[2] === undefined) {
                            newRuleChild.append(
                                'margin-bottom: ' + valueArray[1] + ';' +
                                'padding-left: ' + valueArray[1] + ';'
                            );
                        }
                    }

                    // Divider gutter by two and put on sides if we are centering the grid.
                    if (valueArray[2] !== '_' && valueArray[2] !== undefined) {
                        newRuleChild.append(
                            'margin-bottom: ' + valueArray[1] + ';' +
                            'padding-left: ' + gutterHalfType + ';' +
                            'padding-right: ' + gutterHalfType + ';'
                        );
                    }

                    // Remove the original declaration
                    decl.remove();
                }
            });
        });
    };
});