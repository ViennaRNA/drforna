# DrForna
An interactive viewer for cotranscriptional RNA folding simulations.

<img src="/doc/Screenshot.png"> 

## For installation, development, build, documentation, run:

  `npm install`  
  `npm run serve`
  `npm run build`
  `npm run jsdoc`

Those commands are defined in [webpack.config.js](webpack.config.js).

## Quick start:
Visit [gh-pages](https://bad-ants-fleet.github.io/drforna/) to use the app,
e.g. view the example simulation or upload your own input file.

### Input format:
The following text is a slice of valid input for DrFrona. It is a white-space
separated value (``csv-like'') table, where the header must contain five fields
with the names *id time occupancy structure energy*. 

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

For a detailed description on the respective input fields, visit the 
publication [Tanasie et al. 2022](https://bioarxiv.com)

### Frontend interactions:

The output shown contains the visual output for a **selected time point** (marked with the **red line** on the time scale): 
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
by a mouse click on the scale area.

## Version
0.9 -- a more or less full rewrite

## Cite
[Tanasie et al. 2022](https://bioarxiv.com)
