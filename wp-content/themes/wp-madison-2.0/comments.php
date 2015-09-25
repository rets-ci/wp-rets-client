<?php
/**
 * The template for displaying Comments.
 *
 * The area of the page that contains both current comments
 * and the comment form. The actual display of comments is
 * handled by a callback to madison_comment() which is
 * located in the inc/template-tags.php file.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
*/
if ( post_password_required() )
	return;

?>
<div class="discussion">
	<h2 class="comments-header">
		<?php if ( 'property' == get_post_type() ) : ?>
			<?php printf( _nx( 'One Inquiry', '%1$s Inquiries', get_comments_number(), 'comments title', 'madison' ), number_format_i18n( get_comments_number() ), '<span>' . get_the_title() . '</span>' ); ?>
		<?php else : ?>
			<?php printf( _nx( 'One comment', '%1$s comments', get_comments_number(), 'comments title', 'madison' ), number_format_i18n( get_comments_number() ), '<span>' . get_the_title() . '</span>' ); ?>
		<?php endif; ?>
	</h2>

	<?php
		comment_form( array(
			'comment_notes_before' => null,
			'comment_notes_after'  => null,
			'title_reply'          => null,
			'title_reply_to'       => null,
			'comment_field'        => '<p class="comment-form-comment"><textarea id="comment" name="comment" cols="45" rows="8" aria-required="true" placeholder="Have a question?"></textarea></p>',
			'logged_in_as'         => '<div class="commenter-avatar">' . get_avatar( get_current_user_id() ) . '</div>',
		));
	?>

	<?php if ( have_comments() ) : ?>
		<div id="comments" class="comments-area content-comments">
			<ol class="comment-list">
				<?php wp_list_comments( array( 'avatar_size' => '180', 'callback' => 'madison_comment' ) ); ?>
			</ol>
		</div>
	<?php endif; ?>

	<?php
		// If comments are closed, let's leave a little note, shall we?
		if ( ! comments_open() && '0' != get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
	?>
		<p class="no-comments"><?php _e( 'Questions are no longer accepted.', 'madison' ); ?></p>
	<?php endif; ?>
</div>

<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
	<nav id="comment-navigation" class="comment-navigation clearfix" role="navigation">
		<h1 class="screen-reader-text"><?php _e( 'Inquiry navigation', 'madison' ); ?></h1>
		<div class="nav-previous left"><?php previous_comments_link( false ); ?></div>
		<div class="nav-next"><?php next_comments_link( false ); ?></div>
	</nav>
<?php endif; ?>