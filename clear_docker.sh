#!/bin/bash

# Fonctions pour afficher du texte en couleur
blue() {
    echo -e "\e[34m$1\e[0m"
}

green() {
    echo -e "\e[32m$1\e[0m"
}

red() {
    echo -e "\e[31m$1\e[0m"
}

# Fonction de vérification de l'état de la commande
check_status() {
    if [ $? -eq 0 ]; then
        green "$1"
    else
        red "Échec : $1"
        exit 1
    fi
}

echo "---------- Vérification des ports ----------"

# Vérifier les ports 8080, 8081 et 5432 en parallèle
ports=("8080" "8081" "5432")

for port in "${ports[@]}"; do
    (
        if lsof -i :"$port" | grep -q LISTEN; then
            cont_name=$(docker ps -qf "expose=$port")
            red "$cont_name est en cours d'exécution sur le port $port."
            if [ -n "$cont_name" ]; then
                read -p "$cont_name est en cours d'exécution sur le port $port. Voulez-vous le stopper? (y/n): " choice
                if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
                    docker stop "$cont_name"
                    check_status "image $cont_name bien stoppé."
                    read -p "Voulez-vous supprimé $cont_name ? (y/n): " choice
                    if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
                        docker rm "$cont_name"
                        check_status "image $cont_name bien supprimé."
                    else
                        red "Annulation de la suppression du conteneur $cont_name."
                    fi
                else
                    red "Annulation de l'arrêt du conteneur $cont_name."
                fi
            else
                blue "Impossible de trouver le conteneur correspondant au port $port."
            fi
        else
            blue "Aucun processus n'existe sur le port $port."
        fi
    ) &
done

# Attendre que toutes les opérations sur les ports se terminent
wait

echo "---------- Vérification des conteneurs ----------"

# Supprimer les conteneurs un par un en parallèle
containers=(
    "b-dev-500-lyn-5-1-area-erwannlaplante_db_1"
    "b-dev-500-lyn-5-1-area-erwannlaplante-server-1"
    "b-dev-500-lyn-5-1-area-erwannlaplante-client_web-1"
    "b-dev-500-lyn-5-1-area-erwannlaplante-client_mobile-1"
)

for container in "${containers[@]}"; do
    if docker ps -a | grep -q "$container"; then
        docker stop "$container" > /dev/null 2>&1 &
        check_status "Conteneur $container bien stoppé."
        docker rm "$container" > /dev/null 2>&1 &
        check_status "Conteneur $container bien supprimé."
    else
        blue "Le conteneur $container n'existe pas."
    fi
done

# Attendre que toutes les opérations sur les conteneurs se terminent
wait

echo "---------- Vérification des images ----------"

# Supprimer les images <none>
dangling_images=$(docker images -f "dangling=true" -q)
if [ -n "$dangling_images" ]; then
    docker rmi $dangling_images > /dev/null 2>&1 &
    check_status "Suppression des images <none> terminée."
else
    blue "Aucune image <none> trouvée."
fi

# Supprimer les images en parallèle
images=(
    "b-dev-500-lyn-5-1-area-erwannlaplante-db"
    "b-dev-500-lyn-5-1-area-erwannlaplante-server"
    "b-dev-500-lyn-5-1-area-erwannlaplante-client_web"
    "b-dev-500-lyn-5-1-area-erwannlaplante-client_mobile"
)

for image in "${images[@]}"; do
    if docker images | grep -q "$image"; then
        docker rmi "$image" > /dev/null 2>&1 &
        check_status "Image $image bien supprimée."
    else
        blue "L'image $image n'existe pas."
    fi
done

# Attendre que toutes les opérations sur les images se terminent
wait

echo "---------- Vérification des volumes ----------"

# Supprimer le volume en parallèle
volumes=(
    "b-dev-500-lyn-5-1-area-erwannlaplante_shared-volume"
    "b-dev-500-lyn-5-1-area-erwannlaplante_database-volume"
)

for volume in "${volumes[@]}"; do
    docker volume ls | grep -q "$volume"
    if [ $? -eq 0 ]; then
        docker volume rm "$volume" > /dev/null 2>&1 &
    else
        blue "Le volume $volume n'existe pas."
    fi
done

# Attendre que toutes les opérations sur les volumes se terminent
wait
