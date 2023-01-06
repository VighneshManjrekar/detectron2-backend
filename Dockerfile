FROM python:3.8-slim-buster

ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

RUN apt-get update -y

RUN apt-get install ffmpeg libsm6 libxext6  -y

RUN apt-get -y install nano git build-essential libglib2.0-0 libsm6 libxext6 libxrender-dev

RUN pip install torch==1.9.0+cpu torchvision==0.10+cpu -f https://download.pytorch.org/whl/torch_stable.html
RUN pip install cython
RUN pip install -U 'git+https://github.com/cocodataset/cocoapi.git#subdirectory=PythonAPI'

RUN python -m pip install detectron2 -f https://dl.fbaipublicfiles.com/detectron2/wheels/cpu/torch1.9/index.html

RUN pip install flask flask-cors requests opencv-python gunicorn pillow numpy

RUN ls -la $APP_HOME/

ENV PORT 5000

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app