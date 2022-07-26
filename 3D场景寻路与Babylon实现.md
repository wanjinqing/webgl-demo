### 3D场景寻路与Babylon实现
2D游戏场景中，经常遇到各种寻路算法，比如Dijkstra’s最短寻路算法，Astar寻路算法等。这些算法同样适用于3D场景。

### 寻路基本算法
寻路算法的基本题设是：已知地图中每个单位(一般是小格子)是否可通行的数据和起始点和终点，求解最短路径。
![image](https://cdn.nlark.com/yuque/0/2022/png/1940263/1658821603195-e7fd8d55-c3d6-4a6e-8b21-6a2a4e4185fc.png)
图中，绿色方块为起点，红色方块为终点。蓝色区域是三个不可通过的方块。已经这些条件，可以求得从绿色方块到达红色方块的最短路径(带红色小球的黑色格子组成的有序方块序列)。

在3d漫游环境中，一般可通过AStar算法和Funnel算法实现。
AStar： https://blog.csdn.net/jinxiul5/article/details/82290123
Funnel: https://blog.csdn.net/fengkeyleaf/article/details/118832924

### babylon实现
babylon中默认没有这些算法的实现，需要一定的插件，比如：babylon-navigation-mesh。是通过AStar算法实现的。
![image](https://cdn.nlark.com/yuque/0/2022/png/1940263/1658822014410-261a396a-b4e0-4d43-af99-ef4dba776155.png)
要在babylon中使用导航网格，先得在blender中制作对应的NavMesh，该Mesh本质上由一系列可通行的三角形组成的。教程：babylon中使用NavMesh。

![image](https://cdn.nlark.com/yuque/0/2022/png/1940263/1658822161460-a95c33fc-9a5d-472a-85c1-a731c78253b2.png)

黑色区域为不可通行区域，白色部分是可以自由通行区域。点击试玩官方
![demo](http://wanadev.github.io/babylon-navigation-mesh/)

核心代码：
```javascript
const navigation = new Navigation();

const loadScene = function() {
  //load babylon scene of museum
  const onLoaded = function(loadedScene) {
    // 测试用，wireframe形式显示导航区域
    const navmesh = scene.getMeshByName("Navmesh");
    navmesh.material = new BABYLON.StandardMaterial("navMaterial", scene);
    navmesh.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    navmesh.material.alpha = 0.5;
    navmesh.material.wireframe = true;
  
    for (var i = 0; i < scene.meshes.length; i++) {
      scene.meshes[i].convertToFlatShadedMesh();
    }

    // 生成导航节点，算法需求
    const zoneNodes = navigation.buildNodes(navmesh);
    navigation.setZoneData('level', zoneNodes);
  };

  BABYLON.SceneLoader.Append("./demo/mesh/", "level.babylon", scene, onLoaded.bind(this));
};

// 使用算法寻找路径
const path = navigation.findPath(player.position, pickingInfo.pickedPoint, 'level', navigation.getGroup('level', player.position)) || [];
```
