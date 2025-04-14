**petlab-test**

**Install project locally**

Install project dependencies with npm i

**Run the project locally**

Make sure you are in the project directory(i.e. petlab-test). Use pwd to ensure your project location and then use cd petlab-test and enter if needed.

Use below command in order to run the feature file using headed mode on cypress: npm run test or npx cypress open

Use below command in order to run the feature file headless mode on cypress: npm cypress run

**Run the project through Docker**

Create new or select an existing docker image where the above project needs to be executed.

Creation of new docker image can be achieved through below command: docker build --no-cache -t <image_name> .

Check whether above selected docker image is downloads succesfully or not via below command: docker image ls

Run the container: docker run -i -t cypress run --spec cypress/integration/**/*.js —browser
