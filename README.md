## DrFornaA
DrFornaA is a web component for visualizing co-transcriptional RNA folding.

As an input, the program takes a DrTransformer (short for "DNA-to-RNA transformer") `.drf` output file, containing the details of the cotranscriptional folding simulation.

## To start this project in development mode, please run:

  `npm install`  
  `npm start`

## User Documentation:
You can either select one of the predefined examples or upload your own input file. 

The **input file** should be a space separated values file (multiple spaces are allowed) with header "id time occupancy structure energy".

`id time occupancy structure energy`\
`5 0.5399146247695 8.470447e-01 ...........(((((.....)))))..  -5.80`\
`4 0.5399146247695 1.164858e-01 (((((((......)))).))).......  -1.70`\
`2 0.5399146247695 2.702974e-02 .((((((......)))).))........  -0.80`\
`5 0.539938232645 8.471626e-01 ...........(((((.....)))))..  -5.80`\
`4 0.539938232645 1.163944e-01 (((((((......)))).))).......  -1.70`\
`2 0.539938232645 2.700322e-02 .((((((......)))).))........  -0.80`\
`5 0.54011268395 8.480309e-01 ...........(((((.....)))))..  -5.80`\
`4 0.54011268395 1.156896e-01 (((((((......)))).))).......  -1.70`\
`2 0.54011268395 2.683970e-02 .((((((......)))).))........  -0.80`\
`5 0.559866395 9.186655e-01 ...........(((((.....)))))..  -5.80`\
`4 0.559866395 5.835607e-02 (((((((......)))).))).......  -1.70`\
`2 0.559866395 1.353858e-02 .((((((......)))).))........  -0.80`

Where `id` groups structures, `time` is the time point for which the structure and the occupancy are measured. `occupancy` is the occupancy of that structure at that specific time point. The secondary structure is given in dot-bracket notation in the `structure` column while the free energy (in kcal / mol) is shown in the `energy` column.

The `id` is used in this tool as a unique identifier for the structures to generate the colors above the time scale. Two structures are considered the same (and hence can have the same `id)` if they only differ by the number of unpaired end-nucleotides. For example, the structures  `.(((((.....)))))..` and `.(((((.....)))))..........` can have the same `id`, but they do not have to. Using running `id`'s is also possible. In case your input file does not follow this convention, the plots will still be displayed correctly, but the coloring above the scale will not. 

An occupancy treshhold of 0.01 was used, hence structures with a smaller occupancy will not be displayed.

The output shown contains the visual output for a **selected time point** (marked with the **red line** on the time scale): 
- each **structure** is shown in the **rectangle** marked with the **ID** of the structure in the corner.
- the **size** of each rectangle will be **proportional to the occupancy** of the corresponding structure at the selected time point.
- each nucleotide will be **colored according to the helix** it is part of, while unpaired nucleotides remain uncolored.
- the **black line** on the time scale marks the end of transciption, which splits the scale into the **linear cotranscriptional time scale** and the **logarithmic scale for time steps after the end of transcription**.
- for each time point, the **vertical section of the colors** shown on the scale correspond to the nucleotide colors of the most occupied structure present at the selected time point.
- a **summary** of the content of the file for the selected timepoint will be shown **as a table**. Each nucleotide of the structure (in dot bracket notation) will be also colored according to the helix it is part of. The `id` of the most occupied structure for that particular time point will be also marked in the table.

In the area of the time scale, you can activate or deactivate the mouse with a click. When the mouse is active, you can move the mouse left or right to **select a time point interactively**.

The **Play/Pause** starts the animation: the structures are shown for every time point in the input file. These were marked with small circles on the time scale.  The animation can be deactivated either by clicking the button again or by a mouse click on the scale area.

By clicking the **Download** button, a file containing the visual output will be downloaded. A notification containing the name of the file will appear.

The **Fullscreen** button displays the visual output in fullscreen mode.

## Screenshot:
<img src="/public/Screenshot.png"> 
