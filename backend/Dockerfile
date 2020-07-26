FROM node:alpine

# Stop using Root user
ENV USER dockerfileUser
# Log debugging variables
ENV NODE_ENV=production
ENV DEBUG '*:error,*:warn'

# Move to app folder
WORKDIR /home/$USER/

# Copy only the app's dependencies to cache that npm install step
ADD ./package.json .

# Install Node dependencies and remove NPM cache
RUN yarn --production && \
    npm cache verify && \
    rm -rf /home/$user/.node-gyp && \
    rm -rf /tmp/npm-*

# Copy the rest of the app
ADD ./index.js ./index.js
ADD ./app ./app

# Expose app port
EXPOSE 3000

CMD [ "npm", "start" ]
