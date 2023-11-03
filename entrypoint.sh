#!/bin/sh

#export ROOT_DIR=/app

echo "Replacing env constants in JS"
for file in /app/assets/*.js;
do
  echo "Processing replace gateway url $file ...";

  sed -i 's|"ENV_REACT_APP_API_URL"|"'${ENV_REACT_APP_API_URL}'"|g' $file
  sed -i 's|"ENV_REACT_APP_BASENAME"|"'${ENV_REACT_APP_BASENAME}'"|g' $file
  sed -i 's|"ENV_REACT_APP_SHOW_USERNAME"|"'${ENV_REACT_APP_SHOW_USERNAME}'"|g' $file
  sed -i 's|"ENV_REACT_APP_LOGOUT_URL"|"'${ENV_REACT_APP_LOGOUT_URL}'"|g' $file

done

exec "$@"
