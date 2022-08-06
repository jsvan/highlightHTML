# highlightHTML
 Adds <mark> tags to highlight a webpage. It works around other interior tags, new paragraphs, bolded text, etc. Allows undo's. 
 I wrote this because the other code I found for highlighting online is brittle, and works only on clean text, and not on the html inherent tree structure.


![image](https://user-images.githubusercontent.com/9337973/179422741-3ecc6bb2-aff5-4573-b4fd-d3a91e1eb3b6.png)




This class will change the html body content to add highlight color to strings copied from the website. It works around internal html tags that may otherwise hinder a naive highlighting approach. The first found matched strings are the ones highlighted. The three public facing functions are:

 * addCol(stringFromWebsite, stringHTMLcolor)
    - This is the highlight functions. It finds the first match of stringFromWebsite in the HTML body, and colors it stringHTMLcolor. 
 
 * undo()
    - This undoes your previous highlight. 
 
 
 * addContext(stringfromwebsite)
    - This allows you to enter a large chunk of string from the website to act as a search substring, to help you highlight the correct string. 
    -  **DO NOT USE. BROKEN and NOT DEBUGGED FOR THIS GENERAL TASK (You are welcome to though): **

 
 Disclaimer:
I do not code Javascript, so much of this might be very poorly written and inefficient. But whatever. :)
