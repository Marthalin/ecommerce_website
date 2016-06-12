var items = new Firebase("https://fiery-inferno-1887.firebaseio.com/items")
var nowItem = "";


function saveItems(title, price, descrip, pic) {
items.push({title:title,price:price,descrip:descrip,imgD:pic,userTime:new Date($.now()).toLocaleString()});
}

function viewAllItems() {
items.once("value",readItems);
}

function showAllItems() {
items.on("value",readItems);
}

function updateItem(title, price, descrip, pic) {
items.update({title:title,price:price,descrip:descrip,imgD:pic,userTime:new Date($.now()).toLocaleString()});
}

function selectExpItems() {
items.orderByChild("price").startAt(10000).on("value",readItems);
}

function selectCheapItems() {
items.orderByChild("price").endAt(9999).on("value",readItems);
}

function removeItems() {
items.remove();
}

function readItems(snapshot) {
var allData = snapshot.val();
$("#items").empty();
for(var itemData in allData)
{
  var itemView = createItems(allData[itemData],itemData);
  $("#items").append(itemView);
}
}

//------------------------------------------------------------------------
function getItemByURL(suburl) {
  return new Firebase("https://<YOUR ID>.firebaseio.com/"+suburl);
}

function reArrangeItems(snapshot, former) {
  var newDa = snapshot.val();
  $("#items").append(createItems(newDa, newDa.key));
}

function createItems(itemData,key) {
  var picPart = createPic(itemData.imgD, key);
  var wordPart = createIntro(itemData.title, itemData.price, "anonymous");
  var itemView = $("<div>",{
    class: "sale-item",
  }).append(picPart).append(wordPart);
  return itemView;
}
function picBack(imgD) {
  //var bb = new Blob([imgD],{type:'image/jpeg'})
  //var shortURL = URL.createObjectURL(bb);
  //console.log(shortURL);
  return $("<div>",{
    class: "pic",
  }).css("background-image", 'url('+ imgD + ')');
}

function updateModal(e, upData) {
  $("#upload-modal").modal('show');
  $("input:nth-of-type(1)").val(upData.title);
  $("input:nth-of-type(2)").val(upData.price);
  $("textarea").val(upData.descrip);
  $("#ModalLabel").text("Edit Item");
  $("#submitData").css("display","none");
  $("#editData").css("display","inline-block");
  $("#removeData").css("display","inline-block");
}

function createPic(imgD, key) {
  var picNode = picBack(imgD).append($("<div>",{class: "white-mask"}).append(
    $("<div>",{class: "option"}).append(
      $("<h6>", {text: "view"})
    ).append($("<h6>", {text: "edit", on:{
          click: function (e) {
            nowItem = key;
            var data = getItemByURL("items/"+ key);
            data.once("value", function (snapshot) {
              updateModal(e, snapshot.val());
            })
          }
        }
  }))
  ));
  return picNode;
}
function createIntro(title, price, author) {
  return $("<div>", {class: "word"}).append(
    $("<div>", {class: "name-price"}).append(
      $("<p>",{text: title})
    ).append(
      $("<p>",{text: '$' + price})
    )
  ).append(
    $("<div>", {class: "seller"}).append(
      $("<a>",{href: "#", text: author})
    )
  )
}
// show the thumbnail (not yet)
function picShow(event) {
//   var file = event.target.files[0];
//   var picTrans = new FileReader();
//   picTrans.onload = (function (imge) {return function (e) {
//     imge.src = e.target.result;
//     console.log(e.target.result);
//   }})(file);
//   //console.log(file);
//   picTrans.readAsDataURL(file);
//   //console.log(picTrans.readAsDataURL(file).result);
}
//--------------------------------------------------------------------
showAllItems();
//---------------------------------------------------------------------
$("#submitData").click(function (event) {
  var dataArr = $("#item-info").serializeArray();
  var picFile = $("#picData")[0].files[0];
  var picTrans = new FileReader();
  if (dataArr[0].value != null && dataArr[1].value != null && dataArr[2].value != null && picFile ) {
    //check if it is picture(not yet)

    picTrans.readAsDataURL(picFile);
    picTrans.onloadend = (function (imge) {return function (e) {
        imge.src = e.target.result;
        saveItems(dataArr[0].value, dataArr[1].value, dataArr[2].value, e.target.result);
    }})(picFile);
    $("#upload-modal").modal('hide');
  }

});

$("#editData").click(function (event) {
  var dataArr = $("#item-info").serializeArray();
  var picFile = $("#picData")[0].files[0];
  var picTrans = new FileReader();
  if (dataArr[0].value != null && dataArr[1].value != null && dataArr[2].value != null && picFile ) {
    //check if it is picture(not yet)

    picTrans.readAsDataURL(picFile);
    picTrans.onloadend = (function (imge) {return function (e) {
        imge.src = e.target.result;
        updateItem(dataArr[0].value, parseInt(dataArr[1].value), dataArr[2].value, e.target.result);
    }})(picFile);
    $("#upload-modal").modal('hide');
  }
});

$("#signin").click(function () {

});

$("#removeData").click(function () {
  removeItems();
  $("#upload-modal").modal('hide');
});

$("#price-select span:nth-of-type(1)").click(function (event) {
  viewAllItems();
});

$("#price-select span:nth-of-type(2)").click(function (event) {
  selectExpItems(event);
});

$("#price-select span:nth-of-type(3)").click(function (event) {
  selectCheapItems();
});

$("#upload-modal").on('hidden.bs.modal', function (e) {
  $("#item-info :input").val("");
  $("#picData").val("");
  $("#ModalLabel").text("New Item");
  $("#editData").css("display","none");
  $("#removeData").css("display","none");
  $("#submitData").css("display","inline-block");
});

$("#picData").change(function (e) {
  picShow(e);
});


var ref = new Firebase("https://fiery-inferno-1887.firebaseio.com");
ref.authWithOAuthPopup("facebook", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});