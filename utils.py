from detectron2.config import get_cfg
from detectron2.engine import DefaultPredictor
from detectron2 import model_zoo
from detectron2.data import MetadataCatalog
from detectron2.utils.visualizer import Visualizer
import numpy as np
from PIL import Image

classes=['madoqua guentheri', 'tapirus bairdii', 'crax rubra', 'meleagris ocellata', 'loxodonta africana', 'aepyceros melampus', 'puma concolor', 'cephalophus nigrifrons', 'tayassu pecari', 'panthera onca', 'bos taurus', 'leopardus pardalis', 'mazama temama', 'dasyprocta punctata']

cfg = get_cfg()
cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
cfg.MODEL.ROI_HEADS.NUM_CLASSES = len(classes)
cfg.MODEL.WEIGHTS = "./model_0299999.pth" # path to the model
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.7
cfg.MODEL.DEVICE='cpu'
animal_metadata=MetadataCatalog.get("animal_dataset_train").set(thing_classes=classes)
predictor = DefaultPredictor(cfg)

def get_prediction(img):
    outputs = predictor(img)
    labels=[]
    for i in outputs["instances"].pred_classes.tolist():
        labels.append(classes[i])
    predictions = {
        "class": labels,
        "bbox": outputs["instances"].pred_boxes.tensor.tolist(),
        "confidence":outputs["instances"].scores.tolist()
    }
    return predictions
