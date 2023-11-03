FROM node:18
WORKDIR /app
RUN npm install --global vite
COPY build/ .
COPY entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh
#RUN sed -i -e 's/\r$//' entrypoint.sh
ENV ENV_REACT_APP_API_URL $ENV_REACT_APP_API_URL
ENV ENV_REACT_APP_BASENAME $ENV_REACT_APP_BASENAME

ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 5173
CMD [ "vite", "/app", "--host"]
