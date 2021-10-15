#!/usr/bin/env bash
# Tên images sẽ tạo
IMAGE_NAME=tranngochieu29/ubuntu-custom:StudentSocial_API

HOST_PORT=3000 # Port tương ứng với host

err() {
    echo $* >&2 # Hiển thị lỗi phát sinh ra trong quá trình chạy
}

usage() {
    err "$(basename $0): [build|run|all|login]" # Xuất log chỉ được nhận 1 trong 4 params sau
}

clean() {
    # Lấy ra Container ID
    CONTAINER=$(docker ps -a --filter ancestor=$IMAGE_NAME --format {{.ID}})
    # Kiểm tra container có đang chạy hay không? (sử dụng cho lần chạy đầu tiên)
    if [ $CONTAINER ]
    then
        # Dừng và xóa container cũ
        docker rm -f $CONTAINER
        # Xóa image cũ
        docker rmi -f $IMAGE_NAME
    else
        echo "Image does not exist"
        #docker pull $IMAGE_NAME
    fi
}

build_docker() {
    docker build -t ${IMAGE_NAME} .
}

push_docker() {
    docker push ${IMAGE_NAME}
}

launch() {
    docker run -d -p ${HOST_PORT}:3000 --name StudentSocial_API --restart always ${IMAGE_NAME}
}

login() {
    docker exec -it $(docker ps -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}") /bin/bash
}

execute() {
    local task=${1} # Get task từ command
    case ${task} in
        build)
            clean # Thực thi hàm clean
            build_docker # Thực thi build docker
            ;;
        run)
            launch # Chạy hàm run docker
            ;;
        login)
            login # Login vào docker 
            ;;
        all) # Hàm để thực hiện clean, build và chạy docker
            clean
            build_docker
            push_docker
            launch
            ;;
        *) # Case không xác định
            err "invalid task: ${task}" # Hiển thị error log
            usage
            exit 1
            ;;
    esac
}

main() {
    [ $# -ne 1 ] && { usage; exit 1; }
    local task=${1}
    execute ${task}
}

main $@