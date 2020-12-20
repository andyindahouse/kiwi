#!/bin/sh
# alimentacion desayunos lacteos congelados dieteticos bebidas frescos bebes higiene limpieza
rm ./tmp_log
sections=(alimentacion desayunos lacteos congelados dieteticos bebidas frescos bebes higiene limpieza)
while [ ${#sections[@]} -gt 0 ]
do
    for section in "${sections[@]}"
    do
        npm run list $section 2>&1 >> ./tmp_log
    done
    echo "-----interation done-----"
    sectionDone=($(cat ./tmp_log | grep "Items inserted" | awk '{print $1}'))
    for del in ${sectionDone[@]}
    do
        sections=("${sections[@]/$del}")
    done
    for i in "${!sections[@]}"
    do
        if [ "${sections[i]}" ];
        then
            new_array+=("${sections[i]}")
        fi
    done
    sections=("${new_array[@]}")
    unset new_array
done
echo "finished scraping" >> ./tmp_log
npm run markNotFound $(date +%Y) $(date +%m) $(date +%d) 2>&1 >> ./tmp_log
mv ./tmp_log log_$(date +"%m_%d_%Y")
