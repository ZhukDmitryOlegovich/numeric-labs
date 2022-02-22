array=("npx ts-node . test.txt" "npx ts-node . test2.txt")

echo "Count tests: ${#array[*]}"
for ix in ${!array[*]}
do
    echo "> ${array[$ix]}"
	bash -c "${array[$ix]}"
done
echo
