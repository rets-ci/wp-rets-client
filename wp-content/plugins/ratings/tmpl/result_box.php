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
        <?php
        if(!empty($widgetSettings) ) {
            foreach ($widgetSettings as $k_w => $v_w) {
                $widget_id      = $pluginObj->plugin_name.'-'.$k_w;
                $count_lines    = (int)$v_w['count_lines'];
                $totalCount     = 0;
                for($i = 0; $i < $count_lines;$i++){
                    $totalCount += @(int)$list[$widget_id][$i]->count_clicks;
                }
        ?>
        <div class="table_box">
        <form action="<?php echo $url; ?>" method="post" name="vote_groups">
            <table class="wp-list-table widefat striped posts">
                <thead>
                <tr>
                    <td colspan="2">
                        <h3><?php echo htmlspecialchars($v_w['title']); ?></h3>
                        <?php if(!empty($totalCount) ){ ?>
                        <input onclick="deleteItems(this, 'vote_item')" style="float: right" class="button" value="<?php echo $pluginObj->trans('clear'); ?>" type="button"/>
                        <?php } ?>
                    </td>
                </tr>
                </thead>

                <tbody>
                <?php
                for($i = 0; $i < $count_lines;$i++){
                    $line_title     = htmlspecialchars($v_w['lines_title_'.$i]);
                    $count_clicks   = @(int)$list[$widget_id][$i]->count_clicks;
                    $rate           = @(int)$list[$widget_id][$i]->rate;
                    $percent        = @round($count_clicks * 100 / $totalCount);
                    $urlMore        = $url.'&widget_id='.urlencode(base64_encode($widget_id)).'&rate='.$rate;
                ?>
                    <tr>
                        <td style="width: 60%;"><?php echo $line_title; ?></td>
                        <td>
                            <?php if(!empty($count_clicks) ){ ?>
                            <div class="percent">
                                <div style="width: <?php echo $percent;?>%" class="percent_progress">&nbsp;</div>
                                <a href="<?php echo $urlMore; ?>"><?php echo $percent;?>% (<?php echo $count_clicks; ?>)</a>
                            </div>
                            <?php }else{ ?>
                                0 % (0)
                            <?php } ?>
                        </td>
                    </tr>
                <?php
                }
                ?>
                </tbody>
            </table>
            <input type="hidden" name="form_action" id="form_action" value=""/>
            <input type="hidden" name="widget_id" id="widget_id" value="<?php echo $widget_id;?>"/>
        </form>
        </div>
        <?php
            }
        }
        ?>
    </div>
</div>

<script>
    function deleteItems(button, classItem){
        var button = jQuery(button);

        button.closest('form').find('#form_action').val('delete_box');
        button.closest('form').submit();
    }
</script>
