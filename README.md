## Starting the Web Server ##

python -m SimpleHTTPServer 8008

## Questions ##

* How do we convey the sense of time?
    - labels?
* How do we make it faster?
    - Remove redundant structures
* How do we indicate the change in time?
    - []---[]-------[]-[]
    -What about line breaks?

* What differentiates the structures with the different colors?
    - Different base pairs

* There is no indication of how different the different structures are
  (i.e. two dominant species can differ by a single base pair)
    - Could be improved by using the NAView layout

* Analogy to storyboarding

## Comments about the meeting on October 8th, 2015 ##

* (Ivo) We should have the ability to switch between a linear scale for the
  transcription steps and a logarithmic time scale for the period after the
  completion of the transcription. Each added nucleotide can be represented
  by one or more panels.

* (Ivo) How many panels do we want to display on the home page.

* (Ivo) We could remove the initial single stranded region from the
  visualization to ease some clutter.

* What do users want to see?
    - What is the structure at the end of the folding process?
    - What is the structure after x minutes?

* (Torsten) If particular structures are of interest, we could display all of
  the different structures encountered during the simulation and allow users to
  click on them. When one is selected, its corresponding concentration profile
  could be highlighted.

* (Torsten) Include a threshold selector to show only the lines that are above
  a certain fraction of the population.

* (Andrea or Torsten) Display the events which happen. I.e., nucleotide added,
  interior loop formed, hairpin formed, etc?

* (Ivo) We need to be able to export the data behind the structures (i.e. in
  dot-bracket format).

* (Torsten) What is the first picture the user sees when they enter the web
  site.

* (Ivo?) Do you smoothly go to a final state or are there transient states that 
  appear for some time? The short time scale is often busier than the longer
  time scale.

* (Torsten) Really tiny structure pictures with a fisheye lens to display the
  details.

* (Torsten) Hierarchically cluster the []--[][]----[]--[] type of plot
  according to what changes between the structures. How can we best cluster the
  structures and then expand the clusters, so that there are initially fewer
  lines in the line graph which can later be expanded.

* <random idea> The utility of this approach as a way to to display static
  images or to display results in a presentation.
  
  ### Design Study ###

  * Apple video (fake it 'til you make it)
  * Mention transferability to another domain (abstraction to another such task)
  
      #### Design Study Methodology ####

      * Is the data there?
      * Will this approach still be useful after a few months (after its
        initial use)?
      * A user champion, as somebody that extols the virtue of this software,
        is invaluable.
      * What are the user's expectations?
      * What kinds of questions do they have for this process that might be
        relevant for their research?
      * Use paper sketches to present ideas?
