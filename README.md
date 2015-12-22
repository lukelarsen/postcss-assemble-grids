[PostCSS]:                 https://github.com/postcss/postcss
[PostCSS Custom Media]:    https://github.com/postcss/postcss-custom-media
[Demo]:                    https://jsfiddle.net/lukelarsen/brf1xky7/

# PostCSS Assemble Grid

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.png">

[PostCSS] plugin for easily creating flexbox grids.

## Example
```html
<body>
    <div class="frame">
        <div class="frame-cell  frame-cell--sidebar">
            <div class="sidebar">
                Sidebar
            </div>
        </div>
        <div class="frame-cell">
            <div class="grid">
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est fugiat, nam odit incidunt ab vitae explicabo hic, placeat, aliquid dolorem nisi quisquam omnis nulla eum maxime ipsum magnam non. Nam.</p>
                </div>
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti harum quia nostrum laboriosam perferendis quos aliquid quae voluptate cupiditate sed! Quaerat nisi voluptatem corporis expedita similique placeat itaque voluptatibus eum?</p>
                </div>
                <div class="grid__cell  grid__cell--half">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur autem magnam illum amet odit quasi dolore. Vero reprehenderit odit magni, quis totam aut officiis dignissimos ad, ut minus dicta perspiciatis.</p>
                </div>
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci eos optio ea maxime illum facilis rerum non ex tempora, voluptatem excepturi, in deserunt repellat nostrum distinctio praesentium tempore porro quam.</p>
                </div>
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est fugiat, nam odit incidunt ab vitae explicabo hic, placeat, aliquid dolorem nisi quisquam omnis nulla eum maxime ipsum magnam non. Nam.</p>
                </div>
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti harum quia nostrum laboriosam perferendis quos aliquid quae voluptate cupiditate sed! Quaerat nisi voluptatem corporis expedita similique placeat itaque voluptatibus eum?</p>
                </div>
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur autem magnam illum amet odit quasi dolore. Vero reprehenderit odit magni, quis totam aut officiis dignissimos ad, ut minus dicta perspiciatis.</p>
                </div>
                <div class="grid__cell">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci eos optio ea maxime illum facilis rerum non ex tempora, voluptatem excepturi, in deserunt repellat nostrum distinctio praesentium tempore porro quam.</p>
                </div>
            </div>
        </div>
    </div>
</body>
```

```css
/* For example only. */
body{
    margin: 0;
    padding: 0;
}

/* Using border-box on the grid is required.
   You don't have to apply it to everything.
   You could just apply it to the grid markup. */
*,
*:before,
*:after {
    box-sizing: border-box;
}

/* Plugin Usage */
.frame{
    assemble-grid: fit 30px;
}

.frame-cell--sidebar{
    assemble-grid-cell: 350px;
}

.grid{
    assemble-grid: 1/4 30px;
}

@media all and (max-width: 750px) and (min-width: 200px) {
    .grid{
        assemble-grid-mq: 1/1 20px;
    }
}

.grid__cell--half{
    assemble-grid-cell: 1/2 bottom;
}

/* For example only. */
.sidebar{
    width: 100%;
    background-color: red;
}

.grid__cell p{
    margin: 0;
    background-color: blue;
}
```

Will output:

```css
/* For example only. */
body{
    margin: 0;
    padding: 0;
}

/* Using border-box on the grid is required.
   You don't have to apply it to everything.
   You could just apply it to the grid markup. */
*,
*:before,
*:after {
    box-sizing: border-box;
}

/* Plugin Usage */
.frame{
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    flex-wrap: wrap;
    margin-left: -30px;
}
.frame > *{
    display: flex;
    min-width: 0;
    flex: 1;
    margin-bottom: 30px;
    padding-left: 30px;
}

.frame-cell--sidebar{
    flex: 0 0 350px;
}

.grid{
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    flex-wrap: wrap;
    margin-left: -30px;
}

.grid > *{
    display: flex;
    min-width: 0;
    flex: 0 0 25%;
    margin-bottom: 30px;
    padding-left: 30px;
}

@media all and (max-width: 750px) and (min-width: 200px) {
    .grid{
        margin-left: -20px;
    }
    .grid > *{
        flex: 0 0 100% !important;
        margin-bottom: 20px;
        padding-left: 20px;
    }
}

.grid__cell--half{
    flex: 0 0 50%;
    align-self: flex-end;
}

/* For example only. */
.sidebar{
    width: 100%;
    background-color: red;
}

.grid__cell p{
    margin: 0;
    background-color: blue;
}
```

[Demo]

## Usage

```
npm install postcss-assemble-grids --save-dev
```

### Gulp
```js
var postcss = require('gulp-postcss');
var assembleGrid = require('postcss-assemble-grid');

gulp.task('css', function () {
    var processors = [
        assembleGrid
    ];
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

### Requirements
The use of Assemble Grid requires that box-sizing: border-box; be set on the grid cells. It is common to just apply this to everything with:
```css
*,
*:before,
*:after {
    box-sizing: border-box;
}
```

You can apply it to only the grid if you don't want to apply it to everything in your project. You do this by setting the box-sizing option to true when using assemble-grid:
See more information under 'Options'.
```css
.grid{
    assemble-grid: 1/4 30px _ _ true;
}
```

### Options
#### *assemble-grid*
assemble-grid will set options for all the cells in a grid at once. It should always be used when using Assemble Grid. It builds the base for your grid.
Options for 'assemble-grid' are as follows:<br>
assemble-grid: *Cell Width*, *Gutter Width*, *Grid Width/Center*, *Cell Alignment*, *Box Sizing*

##### Cell Width (required)
This will set the width of all the cells in your grid. Cell Width can be any of the following:
- Fraction (ex. 1/4)
- Number Value (ex. 320px)
- 'fit' (This will fit all cells in a single row.)

##### Gutter Width (optional)
This will set the size of the gutters in your grid. Gutter Width can only be:
- Number Value (ex 30px)

##### Grid Width/Center (optional)
This will give the grid a set width and center it. Grid Width/Center can only be:
- Number Value (ex 850px)

##### Cell Alignment (optional)
This will set the alignment of each cell in the grid. Cell Alignment can be any of the following:
- top
- bottom
- center

##### Box Sizing (optional)
This will add the needed box-sizing: border-box; to each grid cell. Many people prefer this to be included on everyhting with *. If you do not use this on everything you must set this to true. Box Sizing can be:
- true
- false

##### Not setting some options
If you would like to set an option but leave the option before it blank you can do so like this:
assemble-grid: 1/4 _ 800px;
This would set a grid cell width of 25%, no gutters (the '_'), and a fixed grid width of 800px.

<br><br>
#### *assemble-grid-cell*
assemble-grid-cell will allow you to change the behavior of a single grid cell. Let's say you used assemble-grid like this:
```css
.grid{
    assemble-grid: 1/4 30px;
}
```

This makes all the cells in your grid 25% with 30px gutters. Now lets say you want one cell in that grid to be 1/2. On that cell add this:
```css
.grid-cell-half{
    assemble-grid-cell: 1/2;
}
```

This would override the 25% declaration from assemble-grid and make just this cell 50%.

Options for 'assemble-gird-cell' are as follows:<br>
assemble-grid-cell: *Cell Width*, *Cell Alignment*

##### Cell Width (optional)
This will set the width of only this cell. Cell Width can be any of the following:
- Fraction (ex. 1/4)
- Number Value (ex. 320px)

##### Cell Alignment (optional)
This will set the alignment of only this cell. Cell Alignment can be any of the following:
- top
- bottom
- center

##### Both are optional?
Yes, both are optional but you will need at least one of these options when using assemble-cell.

<br><br>
#### *assemble-grid-mq*
Using assemble-grid-mq is for when you need to change the behavior of a grid in a media query. Instead of re-writing all the css for the grid we only override the parts that need changing.
Assemble Grids leaves defining the media queries up to you. A great plugin for this is [PostCSS Custom Media].
After you have defined a media query you can use it like this:

```css
@media all and (max-width: 1000px) and (min-width: 700px) {
    .grid{
        assemble-grid-mq: 1/2 20px;
    }
}
```

This would change the grid to have 50% cell widths and 20px gutters within the given media query.

Options for 'assemble-grid-mq' are as follows:<br>
assemble-grid-mq: *Cell Width*, *Gutter Width*, *Grid Width/Center*, *Cell Alignment*

##### Cell Width (optional)
This will set the width of all the cells in your grid. Cell Width can be any of the following:
- Fraction (ex. 1/4)
- Number Value (ex. 320px)
- 'fit' (This will fit all cells in a single row.)

##### Gutter Width (optional)
This will set the size of the gutters in your grid. Gutter Width can only be:
- Number Value (ex 30px)

##### Grid Width/Center (optional)
This will give the grid a set width and center it. Grid Width/Center can only be:
- Number Value (ex 850px)

##### Cell Alignment (optional)
This will set the alignment of each cell in the grid. Cell Alignment can be an of the following:
- top
- bottom
- center

##### Everything is optional?
Yes, everything is optional but you will need at least one of these options when using assemble-grid-mq.

##### What about assemble-grid-cell-mq?
What if you want to modifiy a single cell in a media query? When modifing a single cell have to override everything that assemble-grid-cell generates so there is no need for a assemble-grid-cell-mq. Just use assemble-grid-cell within a media query and you are good to go.

<br><br>
#### Nesting
Nesting just works. You can next as many grids as you want. With a lot of grid systems you have to nest to achieve what you can probably do with assemble-grid-cell. Check to see if you can accomplish what you need with asseble-grid-cell before you start nesting.
To nest you just need to place another assemble-grid inside a single cell.

<br><br>
#### Extra Info
While not a requirement it is recommended that when you are creating markup for your grids you only apply assemble-grid, assemble-cell, and assemble-mq-grid to a specific html tag. If you need to add style, such as background-color (or anything else), you should do that on a differnt tag withing your grid markup. This will help keep things organized and allow you to re-use your gird classes with out visual style getting in the way. Again, this is just advice. It is not required.
