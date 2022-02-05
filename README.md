## DrFornaA is a tool for visualizing co-transcriptional RNA folding output of DrTransformer
As an input, the programm takes a DrTransformer (short for "DNA-to-RNA transformer") `.drf` output file, containing the details of the cotranscriptional folding simulation.

## To start this project in development mode, please run:

  `npm install`  
  `npm start`

## Using the tool:
You can either select one of the predefined examples or upload your own input file. 

The **input file** should be a space separated values file (multiple spaces are allowed) with header "id time occupancy structure energy".

The output shown contains the visual output for a **selected time point** (marked with the red line on the time scale): 
- each structure is shown in the rectangle marked with the ID of the structure in the corner
- the size of each rectangle will be proportional to the occupancy of the corresponding structure at the selected time point
- each nucleotide will be colored according to the helix it is part of, while unpaired nucleotides remain uncolored
- the black line on the time scale marks the end of transciption, which splits the scale into the **linear cotranscriptional time scale** and the **logarithmic scale for time steps after the end of transcription**
- for each time point, the **vertical section of the colors** shown on the scale correspond to the nucleotide colors of the most occupied structure present at the selected time point
- a **summary** of the content of the file for the selected timepoint will be shown **as a table**. Each nucleotide of the structure (in dot bracket notation) will be also colored according to the helix it is part of

In the area of the time scale, you can activate or deactivate the mouse with a click. When the mouse is active, you can move the mouse left or right to **select a time point interactively**.

The **Play/Pause** function goes through every time point in the input file and can be deactivated either by clicking the button again or by a mouse click on the time scale.

By clicking the **Download** button, a file containing the visual output will be downloaded. A notification containing the name of the file will appear.
