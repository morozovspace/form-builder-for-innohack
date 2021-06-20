#!/bin/bash
bash -e "./sh/helpers/dependency-check.sh"
# Посмотреть что вернет скрипт потому что в случае ошибки он не завершает работу
SHWOMENU=true
function mainmenu {
	echo "Select menu option:"
	select menusel in "Setup" "Development" "Firebase logout" "Exit"; do
	SHWOMENU=false
	case $menusel in
		"Setup")
			# Generate firebase token and write it into firebase.env file
			container_id="firebase-tools"
			docker build  \
			--tag firebase:auth \
			--target firebase \
			-f ./services/firebase/Dockerfile \
			./services/firebase;

			docker run \
			-it \
			--log-driver local \
			--log-opt max-file=3 \
			--log-opt max-size=10m \
			--log-opt compress=true \
			--detach-keys="ctrl-d" \
			--sig-proxy=true \
			--name firebase-tools \
			firebase:auth \
			sh -c \
				"firebase login:ci --interactive --no-localhost | sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g'";
			docker logs ${container_id} > output.log
			logs=$(tail -4 ./output.log)
			array=( $logs )
			echo "FIREBASE_TOKEN=${array[0]}" >> firebase.env
			echo "FIREBASE_AUTH_EMULATOR_HOST=localhost:9099" >> backend.env
			docker container stop firebase-tools
			docker container rm firebase-tools
			docker image rm firebase:auth
			;;
		"Development")
			# Настройки среды разработки
			;;
		"Firebase logout")
			# Выход из Firebase
			logs=$(tail -4 ./output.log)
			array=( $logs )
			# Очистить токен
			echo "FIREBASE_TOKEN=${array[0]}" > firebase.env
			echo "Logout completed" ;;

		"Exit")
			# Не работает выход из приложения
			exit 0 ;;
		*)
			SHWOMENU=true
			echo "Starting default comand"
			# Запустить стандартную команду - зависит от значений, если есть конфигурационные файлы
			# Если не один  из списков меню не подошел то выполнить SHWOMENU=true
	esac
	break
	done
}

while $SHWOMENU; do mainmenu; done