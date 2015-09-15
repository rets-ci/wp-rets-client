<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//vars
$pluginObj      = @$vars['pluginObj'];
$widgetSettings = @$vars['widgetSettings'];
$list           = @$vars['list'];
$url            = @$vars['url'];

?>
<div class="wrap">
    <h2><?php echo $pluginObj->trans('vote_page_result'); ?></h2>

    <div id="vot_result_page">
        <form action="<?php echo $url;?>" method="post" name="vote_groups">
            <table class="wp-list-table widefat striped posts">
                <thead>
                    <tr>
                        <td colspan="4">
                            <input onclick="deleteItems(this, 'vote_item')" style="float: right" class="button" value="<?php echo $pluginObj->trans('delete'); ?>" type="button" />
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30px;text-align: center;">
                            <input style="margin: 0;" type="checkbox" name="all_items" onchange="selectItems(this, 'vote_item')" />
                        </th>
                        <th><?php echo $pluginObj->trans('widget'); ?></th>
                        <th style="width:100px;"><?php echo $pluginObj->trans('rate'); ?></th>
                        <th style="width:100px;"><?php echo $pluginObj->trans('count_click'); ?></th>
                    </tr>
                </thead>

                <tbody>
                <?php
                $tr_index = 0;
                if (!empty($list)) {
                    foreach ($list as $k_item => $v_item) {
                        $tr_index++;
                        $widget_id      = htmlspecialchars($v_item->widget_id);
                        $rate           = (int)$v_item->rate;
                        $count_clicks   = (int)$v_item->count_lines;

                        $widget_title   = @htmlspecialchars($widgetSettings[str_replace($pluginObj->plugin_name.'-','',$widget_id)]['title']);
                        $urlMore        = $url.'&widget_id='.urlencode(base64_encode($widget_id)).'&rate='.$rate;
                        ?>
                        <tr>
                            <td style="text-align: center">
                                <input style="margin: 0;" type="checkbox" name="item_list[]" class="vote_item" value="<?php echo $widget_id.'|'.$rate;?>" onclick="var event = arguments[0] || window.event;event.stopPropagation()" />
                            </td>
                            <td><?php echo $widget_title; ?></td>
                            <td><span class="rate_val"><?php echo $rate; ?></span></td>
                            <td>
                                <a href="<?php echo $urlMore;?>"><?php echo $count_clicks; ?></a>
                            </td>
                        </tr>
                        <?php
                    }
                }
                ?>
                </tbody>
            </table>
            <input type="hidden" name="form_action" id="form_action" value="" />
        </form>
    </div>
</div>

<script>
    function deleteItems(button, classItem){
        var button = jQuery(button);

        if( jQuery('.'+classItem).is(':checked') ){
            button.closest('form').find('#form_action').val('delete_group');
            button.closest('form').submit();
        }else{
            alert('<?php echo $pluginObj->trans('select_item');?>');
        }
    }
</script>
