## Introduction

Dr. Forna is a web component for visualizing co-transcriptional RNA folding.

As input it takes a space separated values (ssv) file:

    id time conc struct energy
    1 0.340000 1.000000 .................   0.00
    1 0.360000 1.000000 ..................   0.00
    1 0.380000 1.000000 ...................   0.00
    2 0.380001 1.537182e-03 .(((.((((...)))).)))  -3.60
    1 0.380001 9.984628e-01 ....................   0.00
    2 0.38000274542 4.214534e-03 .(((.((((...)))).)))  -3.60
    1 0.38000274542 9.957855e-01 ....................   0.00
    2 0.38000753733 1.152803e-02 .(((.((((...)))).)))  -3.60
    1 0.38000753733 9.884720e-01 ....................   0.00
    2 0.38002069313 3.133086e-02 .(((.((((...)))).)))  -3.60
    1 0.38002069313 9.686691e-01 ....................   0.00
    2 0.38005681134 8.367606e-02 .(((.((((...)))).)))  -3.60

Where `id` groups structures, `time` is the time point for which the structure and the
concentration are measures. `conc` is the occupancy of that structures at that time point.
The secondary structure is encoded as a dot-bracket string in the `struct` column while
the free energy (in kcal / mol) is shown in the `energy` column.

## Screenshot

<img src="https://raw.githubusercontent.com/pkerpedjiev/drforna/master/doc/img/drforna_screenshot.png" />

## Starting the Web Server

To start this project in development mode, please run:
```
    npm install
    npm run dev
```
To build a release version run:
```
    npm run build
```
And find the output javascript and style files in the `dist/` directory.

