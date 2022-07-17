# highlightHTML
 Recursive methods to add <mark> tags to highlight a webpage. It works around interior tags, new paragraphs, bolded text, etc. Allows undo's. 


![image](https://user-images.githubusercontent.com/9337973/179422741-3ecc6bb2-aff5-4573-b4fd-d3a91e1eb3b6.png)




This class will change the html body content to add highlight color to strings copied from the website. It works around internal html tags that may otherwise hinder a naive highlighting approach.
I do not guarentee this code is optimal or functions in all cases, but I used this for a quick mockup for a different task. I do not code Javascript in general
so the provided structure and style will probably be shit. The first found matched strings are the ones highlighted. The three public facing functions are:

 * addCol(stringFromWebsite, stringHTMLcolor)
    - This is the highlight functions. It finds the first match of stringFromWebsite in the HTML body, and colors it stringHTMLcolor. 
 
 * undo()
    - This undoes your previous highlight. 
 
 
 **DO NOT USE. BROKEN and NOT DEBUGGED FOR THIS GENERAL TASK (You are welcome to though): **
 * addContext(stringfromwebsite)
    - This allows you to enter a large chunk of string from the website to act as a search substring, to help you highlight the correct string. 

