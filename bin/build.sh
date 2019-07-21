cmd="docker-compose build"

for line in $(cat $(
  cd $(dirname $0)
  cd ../
  pwd
)/.env); do
  if [ ${line:0:1} != '#' ]; then
    if [ $(echo $line | grep "\=") ]; then
      echo ">>> add build arg [$line]."
      cmd="${cmd} --build-arg ${line}"
    fi
  fi
done

$cmd > >(tee ./build-logs.log) 2>&1
echo ">>> build finished."

echo $cmd
