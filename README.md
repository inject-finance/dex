# How to Clone the Repository, Install Dependencies, and Start the App

1. **Clone the repository**: To clone the repository, open your terminal and navigate to the directory where you want to clone the repository. Then, enter the following command:

git clone https://github.com/inject-finance/dex

This will clone the repository to your local machine.

2. **Install dependencies with yarn**: Once you have cloned the repository, navigate to the root directory of the repository and enter the following command to install dependencies with yarn:

yarn

This will install all of the dependencies required for the app.

3. **Add environment variables**: Before starting the app, you'll need to add some environment variables. For the client, create a file called `.env` in the `client` directory of the monorepo and add the following variables:

- NEXT_PUBLIC_DEFAULT_API=“https://example.com/api/v1”
- NEXT_PUBLIC_DEFAULT_API_URL=“https://localhost:3333/v1/”
- NEXT_PUBLIC_DEFAULT_COIN_GECKO_API_URL=“https://api.coingecko.com/api/v3/”
- NEXT_PUBLIC_DEFAULT_HITBTC_API_URL=“https://api.hitbtc.com/api/3/public/”
- NEXT_PUBLIC_ADDRESS_STAKING_OWNER="xx"

Make sure to replace these values with appropriate values for your specific app.

For the server, create a file called `.env` in the `server` directory of the monorepo and add the following variables:

- DB_TYPE=DB_TYPE
- DB_HOST=DB_HOST
- DB_PORT=DB_PORT
- DB_USERNAME=DB_USERNAME
- DB_PASSWORD=DB_PASSWORD
- DB_NAME=DB_NAME
- POSTGRES_SYNC=true
- JWT_SECRET=top_secret_element
- PGADMIN_DEFAULT_EMAIL=admin@admin.com
- PGADMIN_DEFAULT_PASSWORD=admin
- PGADMIN_LISTEN_PORT=80

Make sure to replace these values with appropriate values for your specific app.

4. **Start the app**: To start the client, enter the following command in your terminal:

yarn client dev

To start the server, enter the following command in your terminal:

yarn server dev

After following these steps, your app should be up and running!

## How to Make a Commit

To make a commit in your Git repository, follow these steps:

1. **Add changes to the Git stage** with the command `git add --file`.
   - This command adds changes in the specified file to the Git stage, preparing them to be included in the next commit.
2. **Enter the command `yarn co`** in the terminal and then navigate through the options.
   - This command starts the `@s-ui/mono` tool, which will guide you through the process of creating a commit.
3. **Choose the workspace** where the modified files are located.
   - The workspace is the working area where the files you have modified are located. Make sure to select the correct workspace to include changes in the commit.
4. **Choose the type of commit** (fix, refactor, test, chore).
   - The type of commit describes the nature of the changes you are making. For example, if you are fixing a bug, you can select "fix." If you are refactoring code, you can select "refactor."
5. **Write a description of the command** and then finish by pressing enter.
   - The command description should be clear and concise, and should explain what changes you are making and why. Once you have written the description, press enter to finish and create the commit.

Remember that the tool used to make commits is an npm package called `@s-ui/mono`. You can find more information about this package and how to use it on its npm page.
