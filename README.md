
# Bababot

pixelplace.io bot to draw images and place pixels automatically

Needs [Tampermonkey](https://www.tampermonkey.net/) to run

**Made by Bababoy#1524**

  

## Bababot Guide:

### Shortcuts:

| Key | Description  |
|--|--|
| % | Sets the percentage of pixels to be botted. |
| ; | Sets UI placement mode (UI places as UI / Tasker / Tasker's tasks
| - | _Sets brush size_ **(Deprecated)**

### Image Botting
`#BABAB0 ( RGB 186,186,176 )` is a reserved color to mark a colored pixel as transparent.

  

**WARNING:** Colors close to BABAB0 gets recognized as transparent pixels.

Transparent color can be chosen to be ignored or not by **Filter grey** option.

### Tasker API

Tasker is a sychronous task loop to place pixels.

To place a pixel:

```
Tasker.addTask({
x: x,
y: y,
color: color
})
```

`x,y` are coordinates and color is color code ( integer )

**For dev questions, contact Bababoy#1524**