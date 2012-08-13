# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
jQuery ->
  $('.search').hide()
  $('.carousel').carousel({interval: 10000})
  $(".item").click ->
    $(".search").toggle('slow')
