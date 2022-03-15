function bash-info {
	echo ">> $1"
	bash -c "$1"
}

command="npx ts-node ./test.ts "

echo "Count tests:" $(ls ./test | wc -l)
for file in ./test/*
do
	if [[ $CAT && $CAT != 0 ]]; then
		bash-info "cat ${file}"
	fi
	bash-info "${command}${file}"
	echo
done
