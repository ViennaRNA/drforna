# DrForna
An interactive viewer for cotranscriptional RNA folding simulations.

<img src="/static/docu.svg"> 

## For installation, development, build, documentation, run:

  `npm install`  
  `npm run serve`  
  `npm run build`  
  `npm run jsdoc`  

Those commands are defined in [package.json](package.json).

## Quick start:
Visit [gh-pages](https://viennarna.github.io/drforna/) to use the app,
e.g. view the example simulation or upload your own input file.

### Main input format (DrForna files):
The *DrFrona input file* should be a white-space separated value ("csv-like") file. The header should have the form *id time occupancy structure energy*. 

- *id* groups structures that differ only in the number of unpaired nucleotides at the end. (This grouping is recommended for a better performance, but not mandatory. Alternatively, every structure can have a unique ID, which will not change in the visual output, or the same ID can be used for structures with different base-pairs. However, the latter may lead to unexpected visualization, as the colors in the time point selection panel are defined by first structure for each ID.)

- *time* denotes the time point at which structures are plotted in the ensemble visualization area.
- *occupancy* is the probability of observing the structure in the ensemble at the given time point.
(This affects the size of a structure plot in the ensemble visualization area.)
- *structure* is the structure in dot-bracket notation.
(Pseudoknots are denoted by different sets of parenthesis, or pairs of lowercase/uppercase letters.)

- *energy* is the free energy of the structure.
(The value in this field is not used for visualization.)

### Example input file:
```
id time occupancy structure energy
6 1.47 1.0000 .((((....((((....))))....))))........  -9.30
6 1.48 1.0000 .((((....((((....))))....))))........  -9.30
9 1.49 0.1494 .........((((....))))....((((....)))). -10.00
6 1.49 0.8506 .((((....((((....))))....)))).........  -9.30
9 1.50 0.2693 .........((((....))))....((((....)))). -10.00
6 1.50 0.7306 .((((....((((....))))....)))).........  -9.30
9 1.51 0.3656 .........((((....))))....((((....)))). -10.00
6 1.51 0.6344 .((((....((((....))))....)))).........  -9.30
```
The parameter _min-occupancy_ filters lines from the input file if the occupancy is too low. Note that setting this threshold too low may crash the browser, while a high threshold can delete entire time points for visualization.
<!-- 
For a detailed description on the respective input fields, visit the 
publication [Tanasie et al. 2022](https://bioarxiv.com) -->

### Sequence input format (fasta files, optional):
-The _sequence_ is optional and can be either uploaded using a fasta file or written in the provided text box. Lines starting with the symbol ">" are ignored.

Note: Providing a sequence may cause the colors of nucleotides be perceived darker than in the time point selection panel.

### The visual output contains three parts:
1. The ensemble visualization area (treemap) 
   
   The output shown contains the visual output for a selected time point (marked with a vertical red line on the time point selection panel below):
    - Each rectangle shows a structure together with its ID in the top left corner.
    - The size of a rectangle is proportional to the occupancy of the corresponding structure.
    - Nucleotides in common helices are shown in the same color, unpaired nucleotides remain uncolored.

   Move the mouse over a rectangle to display the occupancy of the corresponding structure.
   
   Click rectangles to zoom in on a structure. A second click zooms out again.

2. The time point selection panel
    - The vertical black line on the time scale marks the end of transcription, and also a transition from a linear time scale to a logarithmic scale.
    - For each time point, the vertical section of the colors shown on the scale correspond to the nucleotide colors of the most occupied structure present at the selected time point.
    - A mouse click on the time scale freezes the visualization at a specific time point. A second click makes the time point selection panel responsive to mouse over events again.
    - The Play/Pause button in the top control panel starts an animation, which can also be deactivated by a mouse click on the scale area.
        <img src="/static/anot.svg"> 
3. The summary table
   - A summary of the input file for the selected time point can be seen in the summary table. The dot bracket notation is colored to match the color scheme of helices in the main visualization area.
      <img src="/static/table.png"> 








<!-- The output shown contains the visual output for a **selected time point** (marked with the **red line** on the time scale): 
- each **structure** is shown in the **rectangle** marked with the **ID** of the structure in the corner.
- the **size** of each rectangle will be **proportional to the occupancy** of the corresponding structure at the selected time point.
- each nucleotide will be **colored according to the helix** it is part of, while unpaired nucleotides remain uncolored.
- the **black line** on the time scale marks the end of transciption, which splits the scale into the **linear cotranscriptional time scale** and the **logarithmic scale for time steps after the end of transcription**.
- for each time point, the **vertical section of the colors** shown on the scale correspond to the nucleotide colors of the most occupied structure present at the selected time point.
- a **summary** of the content of the file for the selected timepoint will be shown **as a table**. Each nucleotide of the structure (in dot bracket notation) will be also colored according to the helix it is part of. The `id` of the most occupied structure for that particular time point will be also marked in the table.

In the area of the time scale, you can activate or deactivate the mouse with a
click. When the mouse is active, you can move the mouse left or right to
**select a time point interactively**.

The **Play/Pause** starts the animation: the structures are shown for every
time point in the input file. These were marked with small circles on the time
scale.  The animation can be deactivated either by clicking the button again or
by a mouse click on the scale area. -->

## Version
0.9 -- a more or less full rewrite

## Cite
[Tanasie et al. 2022](https://bioarxiv.com)
