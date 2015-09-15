<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//vars
$pluginObj      = @$vars['pluginObj'];
$list           = @$vars['list'];
$widgetSettings = @$vars['widgetSettings'];
$url            = @$vars['url'];
$urlMore        = $url.'&widget_id='.@urlencode(base64_encode($list[0]->widget_id)).'&rate='.@(int)$list[0]->rate;
?>
<div class="wrap">
    <h2><?php echo $pluginObj->trans('vote_page_result'); ?></h2>

    <div id="vot_result_page">
        <form action="<?php echo $urlMore;?>" method="post" name="vote_list">
            <table class="wp-list-table widefat striped posts">
                <thead>
                <tr>
                    <td colspan="5">
                        <?php
                        $widget_id      = @htmlspecialchars($list[0]->widget_id);
                        $widget_title   = @htmlspecialchars($widgetSettings[str_replace($pluginObj->plugin_name.'-','',$widget_id)]['title']);
                        $rate           = @(int)$list[0]->rate;
                        $rate_title     = @htmlspecialchars($widgetSettings[str_replace($pluginObj->plugin_name.'-','',$widget_id)]['lines_title_'.$rate]);
                        ?>
                        <span style="font-size: 20px;font-weight: bold">
                            <?php echo $widget_title .' / '. $rate_title;?>
                        </span>

                        <input onclick="deleteItems(this, 'vote_item')" style="float: right" class="button" value="<?php echo $pluginObj->trans('delete'); ?>" type="button" />
                    </td>
                </tr>
                <tr>
                    <th style="width: 30px;text-align: center;">
                        <input style="margin: 0;" type="checkbox" name="all_items" onchange="selectItems(this, 'vote_item')" />
                    </th>
                    <th style="width:140px;"><?php echo $pluginObj->trans('created'); ?></th>
                    <th style="width:140px;"><?php echo $pluginObj->trans('user_ip'); ?></th>
                    <th><?php echo $pluginObj->trans('user_browser'); ?></th>
                    <th style="width:250px;"><?php echo $pluginObj->trans('referer'); ?></th>
                </tr>
                </thead>

                <tbody>
                <?php
                $tr_index = 0;
                if (!empty($list)) {
                    foreach ($list as $k_item => $v_item) {
                        $tr_index++;
                        $id             = (int)$v_item->id;
                        $created        = date('d.m.Y H:i:s', @strtotime($v_item->created));
                        $user_ip        = htmlspecialchars($v_item->user_ip);
                        $user_browser   = htmlspecialchars($v_item->user_browser);
                        $referer        = htmlspecialchars($v_item->referer);
                        $widget_id      = htmlspecialchars($v_item->widget_id);
                        $rate           = htmlspecialchars($v_item->rate);

                        $widget_title   = @htmlspecialchars($widgetSettings[str_replace($pluginObj->plugin_name.'-','',$widget_id)]['title']);
                        ?>
                        <tr>
                            <td style="text-align: center">
                                <input style="margin: 0;" type="checkbox" name="item_list[]" class="vote_item" value="<?php echo $id;?>" onclick="var event = arguments[0] || window.event;event.stopPropagation()" />
                            </td>
                            <td><?php echo $created; ?></td>
                            <td><?php echo $user_ip; ?></td>
                            <td><?php echo $user_browser; ?></td>
                            <td><?php echo $referer; ?></td>
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
            button.closest('form').find('#form_action').val('delete_vote');
            button.closest('form').submit();
        }else{
            alert('<?php echo $pluginObj->trans('select_item');?>');
        }
    }
</script>
