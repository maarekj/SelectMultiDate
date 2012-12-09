SelectMultiDate
================================================================================

Plugin jQuery qui permet de sélectionner plusieurs dates à l'aide d'un datepicker
[http://maarekj.github.com/SelectMultiDate/](http://maarekj.github.com/SelectMultiDate/)

Auteur
--------------------------------------------------------------------------------
Joseph Maarek

Infomations connexes:
--------------------------------------------------------------------------------
Ce plugin utilise est un plugin jQuery (1.7.1). Il utilise le datepicker 
jQueryUI (1.8.16), et le plugin jquery.textext-1.3.0.
Ainsi qu'un thême customisé de jQueryUI trouvé sur le net (avec
quelques ajouts pour les dates sélectionnées)

- [Doc de jQuery](http://docs.jquery.com/Main_Page)
- [Tuto pour faire un plugin jQuery](http://www.jquery.info/spip.php?article92)
- [Doc de jquery.textext](http://textextjs.com/)

Exemples:
--------------------------------------------------------------------------------
[Voir un exemple](http://maarekj.github.com/SelectMultiDate/demos)

Documentation:
--------------------------------------------------------------------------------
### Options ###

- __culture__:            Possibilité de choisir la culture du widget
- __dateFormat__:         Possibilité de choisir le format d'affichage
- __maxDate__:            Possibilité de limité le nombre de date selectionnable
- __enabledShortcuts__:   Active les raccourcies clavier:
    - _Shift + Click_ =>    sélection/désélection du mois entier
    - _Alt + Click_ =>      sélection/désélection de la semaine entière
    - _Cmd/Ctrl_ =>         sélection/désélection de tout la colonne.
- __disabledDayOfWeek__:  Désactive certaines jour de la semaine (un tableau 
    contenant les jours à désactivé, par exemple [0, 6] désactivera le dimanche
    et le lundi).
- __disabledDates__:      Désactive certaines dates précises, exemple:
  _['2012-07-14', '2012-08-05']_

### Events ###
- __addedDate__:          Quand une date est séléctionnée
- __removedDate__:        Quand une date est supprimée.
- __cleared__:            Quand le widget est vidé via la fonction clear.

### Functions ###
- __addDates__:           Ajouter plusieurs dates.
- __removeDates__:        Supprimer plusieurs dates.
- __refresh__:            Met à jour le calendrier.
- __getDates__:           Recupèrer les dates séléctionnées.
- __clear__:              Vide le widget.

Utilisation:
--------------------------------------------------------------------------------
```html
    <div id="multi-date"></div>
    <script>
      $(function() {
        $('#multi-date').selectMultiDate({
          culture:            'fr',
          dateFormat:         'dd/mm/yy',
          maxDate:            0,
          enabledShortcuts:   true,
          disabledDayOfWeek:  [0, 6],
          disabledDates:      ['2012-07-14', '2012-08-05']
        })
        .on('addedDate', function(e, date) {
          console.log(date);
        })
        .selectMultiDate('addDates', ['2012-04-06', '2012-06-19'])
       });
     </script>
```